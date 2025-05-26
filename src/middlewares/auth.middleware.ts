import { Elysia } from 'elysia';
import { JwtUtils } from '../utils/jwt.utils';
import { ResponseHandler } from '../utils/response.utils';

/**
 * ตรวจสอบว่า request มี valid JWT token หรือไม่
 */
export const authMiddleware = new Elysia()
  .derive(async ({ request }) => {
    // ดึง Authorization header
    const authHeader = request.headers.get('Authorization') || undefined;
    
    // ตรวจสอบและถอดรหัส token
    const user = await JwtUtils.getTokenFromHeader(authHeader);
    
    // ส่งข้อมูล user กลับเพื่อใช้ในขั้นตอนต่อไป
    return {
      user
    };
  });

/**
 * ตรวจสอบว่าผู้ใช้ได้ยืนยันตัวตนแล้วหรือไม่ (มี valid JWT token)
 */
export const requireAuth = new Elysia()
  .use(authMiddleware)
  .derive({ as: 'global' }, ({ user }) => {
    // ถ้า user เป็น null หมายความว่า token ไม่ถูกต้องหรือไม่มี token
    if (!user) {
      return ResponseHandler.unauthorized('Authentication required');
    }
    
    return { user };
  });

/**
 * ตรวจสอบว่าผู้ใช้มี role ที่กำหนดหรือไม่
 */
export const requireRole = (role: string) => new Elysia()
  .use(requireAuth)
  .onBeforeHandle(({ user, set }) => {
    // ตรวจสอบว่าผู้ใช้มี role ที่ต้องการหรือไม่
    if (user.role !== role && user.role !== 'admin') {
      set.status = 403;
      return ResponseHandler.forbidden('You do not have permission to access this resource');
    }
  });
