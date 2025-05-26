import { Elysia } from 'elysia';
import { ResponseHandler } from '../utils/response.utils';

interface RateLimitOptions {
  max: number;        // จำนวน request สูงสุดต่อ window
  windowMs: number;   // ช่วงเวลา window เป็นมิลลิวินาที
  message?: string;   // ข้อความที่แสดงเมื่อเกิน rate limit
  keyGenerator?: (request: Request) => string; // ฟังก์ชันสร้าง key สำหรับระบุผู้ใช้
}

/**
 * Middleware สำหรับจำกัดจำนวน request (Rate Limiting)
 * ป้องกันการโจมตีแบบ brute force หรือ DOS
 */
export function rateLimit(options: RateLimitOptions = {
  max: 100,
  windowMs: 60 * 1000, // 1 นาที
  message: 'Too many requests, please try again later'
}) {
  // Store สำหรับเก็บข้อมูลการเข้าถึงของแต่ละ IP
  const store: Record<string, { count: number, resetTime: number }> = {};

  // ฟังก์ชั่นสำหรับสร้าง key (เริ่มต้นใช้ IP address)
  const keyGenerator = options.keyGenerator || ((request: Request) => {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return ip;
  });

  return new Elysia()
    .derive(({ request, set }) => {
      const key = keyGenerator(request);
      const now = Date.now();
      
      // เริ่มสร้างข้อมูลสำหรับ IP นี้ถ้ายังไม่มีในระบบ
      if (!store[key]) {
        store[key] = {
          count: 0,
          resetTime: now + options.windowMs
        };
      }
      
      // ตรวจสอบว่าถึงเวลา reset หรือไม่
      if (now > store[key].resetTime) {
        store[key] = {
          count: 0,
          resetTime: now + options.windowMs
        };
      }
      
      // เพิ่มจำนวนการเข้าถึง
      store[key].count++;
      
      // ตรวจสอบว่าเกินขีดจำกัดหรือไม่
      if (store[key].count > options.max) {
        // คำนวณเวลาที่ต้องรอ
        const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
        
        // ส่งข้อมูล rate limit กลับไปที่ client
        set.status = 429;
        set.headers = {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': options.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(store[key].resetTime / 1000).toString()
        };
        
        return {
          success: false,
          message: options.message,
          data: { 
            retryAfter,
            limit: options.max,
            remaining: 0,
            reset: Math.ceil(store[key].resetTime / 1000)
          }
        };
      }
      
      // ส่งข้อมูล rate limit ผ่าน headers
      set.headers = {
        'X-RateLimit-Limit': options.max.toString(),
        'X-RateLimit-Remaining': (options.max - store[key].count).toString(),
        'X-RateLimit-Reset': Math.ceil(store[key].resetTime / 1000).toString()
      };
      
      return {};
    });
}
