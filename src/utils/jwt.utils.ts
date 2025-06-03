import { jwt } from '@elysiajs/jwt';
import { User } from '../interfaces/user';
import crypto from 'crypto';

// ค่า secret key สำหรับ JWT (ควรใช้จาก environment variable ในการใช้งานจริง)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // make sure to set this in .env in production
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key'; // make sure to set this in .env in production

// กำหนดระยะเวลาหมดอายุของ token
const TOKEN_EXPIRY = '15m'; // 15 minutes for access token
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days for refresh token

// สร้าง JWT instance
const jwtInstance = jwt({
  name: 'auth-token',
  secret: JWT_SECRET,
  exp: TOKEN_EXPIRY,
});

// Store สำหรับเก็บ refresh tokens
// ในงานจริงควรเก็บใน database เพื่อสามารถ invalidate tokens ได้
const refreshTokenStore: Record<string, {
  userId: string | number,
  token: string,
  expiresAt: number
}> = {};

/**
 * ยูทิลิตี้สำหรับการจัดการ JWT token
 */
export class JwtUtils {
  /**
   * สร้าง access token และ refresh token สำหรับ user
   */
  static async generateTokens(user: Partial<User>): Promise<{ accessToken: string, refreshToken: string }> {
    // สร้าง payload โดยไม่รวมข้อมูลที่ละเอียดอ่อน เช่น รหัสผ่าน
    const payload = {
      id: user.id || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user'
    };
    
    // สร้าง access token
    const accessToken = await jwtInstance.decorator['auth-token'].sign(payload);
    
    // สร้าง refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // เก็บ refresh token ใน store
    const userId = user.id?.toString() || '';
    
    refreshTokenStore[refreshToken] = {
      userId,
      token: refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    return { accessToken, refreshToken };
  }
  
  /**
   * สร้าง access token จาก refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string } | null> {
    // ตรวจสอบว่า refresh token มีอยู่ใน store หรือไม่
    const storedToken = refreshTokenStore[refreshToken];
    
    if (!storedToken || storedToken.expiresAt < Date.now()) {
      // ถ้า refresh token ไม่มีอยู่หรือหมดอายุ
      if (storedToken) {
        // ลบ expired token
        delete refreshTokenStore[refreshToken];
      }
      return null;
    }
    
    // สร้าง payload จาก userId
    const userId = storedToken.userId;
    
    // สร้าง access token ใหม่
    const accessToken = await jwtInstance.decorator['auth-token'].sign({ id: userId });
    
    return { accessToken };
  }
  
  /**
   * ยกเลิก refresh token
   */
  static revokeRefreshToken(refreshToken: string): boolean {
    if (refreshTokenStore[refreshToken]) {
      delete refreshTokenStore[refreshToken];
      return true;
    }
    return false;
  }
  
  /**
   * สร้าง JWT token สำหรับ user (สำหรับความเข้ากันได้กับโค้ดเดิม)
   */
  static async generateToken(user: Partial<User>): Promise<string> {
    const { accessToken } = await this.generateTokens(user);
    return accessToken;
  }
  
  /**
   * ตรวจสอบและถอดรหัส token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      return await jwtInstance.decorator['auth-token'].verify(token);
    } catch (error: any) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
  
  /**
   * ตรวจสอบ token จาก Authorization header
   * @param authHeader - Authorization header จาก request
   * @returns decoded token หรือ null ถ้าไม่มี token หรือ token ไม่ถูกต้อง
   */
  static async getTokenFromHeader(authHeader: string | undefined): Promise<any> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    // แยก token จาก header (format: "Bearer {token}")
    const token = authHeader.split(' ')[1];
    
    try {
      return await this.verifyToken(token);
    } catch (error) {
      return null;
    }
  }
}
