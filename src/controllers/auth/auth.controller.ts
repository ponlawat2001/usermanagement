import Elysia, { t } from "elysia";
import { User } from "../../interfaces/user";
import { ResponseHandler } from "../../utils/response.utils";
import { UserRepo } from "../../repositories/user.repo";
import { loginSchemaUser } from "../../schemas/user/user.schema";
import { JwtUtils } from "../../utils/jwt.utils";
import { requireAuth } from "../../middlewares/auth.middleware";

const userRepo = new UserRepo();

// สร้าง schema สำหรับ refresh token
const refreshTokenSchema = t.Object({
  refreshToken: t.String({
    description: 'The refresh token issued during login',
    minLength: 10
  })
});

// สร้าง schema สำหรับเปลี่ยนรหัสผ่าน
const changePasswordSchema = t.Object({
  currentPassword: t.String({
    description: 'Current password',
    minLength: 6
  }),
  newPassword: t.String({
    description: 'New password',
    minLength: 8,
    maxLength: 100
  }),
  confirmNewPassword: t.String({
    description: 'Confirm new password',
    minLength: 8,
    maxLength: 100
  })
});

export const AuthController = new Elysia({ prefix: "/auth" })
  .post("/login", 
    async ({ body }) => {
      const { usernameOrEmail, password } = body;
      
      // ตรวจสอบการเข้าสู่ระบบ
      try {
        // ค้นหา user จาก username หรือ email
        const user = await userRepo.findByUsernameOrEmail(usernameOrEmail);
        
        if (!user) {
          return ResponseHandler.unauthorized("Invalid username/email or password");
        }
        
        // ตรวจสอบรหัสผ่านโดยใช้ Bun.password.verify เพื่อเปรียบเทียบรหัสผ่านที่เข้ารหัสแล้ว
        let isPasswordValid = false;
        try {
          isPasswordValid = await Bun.password.verify(password, user.password);
        } catch (err) {
          console.error('Password verification error:', err);
          isPasswordValid = false;
        }
        
        if (!isPasswordValid) {
          return ResponseHandler.unauthorized("Invalid username/email or password");
        }
        
        // สร้าง JWT token และ refresh token สำหรับ user
        const { accessToken, refreshToken } = await JwtUtils.generateTokens(user);
        
        // สร้าง response สำหรับการเข้าสู่ระบบสำเร็จ พร้อมกับ token
        return ResponseHandler.success({
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
          }
        }, "Login successful");
      } catch (error: any) {
        return ResponseHandler.serverError(error.message || "Login failed");
      }
    },
    {
      body: loginSchemaUser,
      detail: {
        summary: 'User login',
        description: 'Authenticate a user and return a session token',
        tags: ['Authentication']
      }
    }
  )
  
  // แอนด์พอยท์สำหรับ refresh token
  .post("/refresh-token",
    async ({ body }) => {
      try {
        const { refreshToken } = body;
        
        // สร้าง access token ใหม่จาก refresh token
        const result = await JwtUtils.refreshAccessToken(refreshToken);
        
        if (!result) {
          return ResponseHandler.unauthorized("Invalid or expired refresh token");
        }
        
        // ส่ง access token ใหม่กลับไป
        return ResponseHandler.success({
          accessToken: result.accessToken
        }, "Token refreshed successfully");
      } catch (error: any) {
        return ResponseHandler.serverError(error.message || "Failed to refresh token");
      }
    },
    {
      body: refreshTokenSchema,
      detail: {
        summary: 'Refresh access token',
        description: 'Generate a new access token using a valid refresh token',
        tags: ['Authentication']
      }
    }
  )
  
  // แอนด์พอยท์สำหรับออกจากระบบ
  .post("/logout",
    async ({ body }) => {
      try {
        const { refreshToken } = body;
        
        // ยกเลิก refresh token
        JwtUtils.revokeRefreshToken(refreshToken);
        
        return ResponseHandler.success(null, "Logged out successfully");
      } catch (error: any) {
        return ResponseHandler.serverError(error.message || "Failed to log out");
      }
    },
    {
      body: refreshTokenSchema,
      detail: {
        summary: 'Logout',
        description: 'Invalidate the refresh token',
        tags: ['Authentication']
      }
    }
  )
  
  // แอนด์พอยท์สำหรับเปลี่ยนรหัสผ่าน
  .use(requireAuth)
  .post("/change-password",
    async ({ body, user }) => {
      try {
        const { currentPassword, newPassword, confirmNewPassword } = body;
        
        // ตรวจสอบว่า newPassword และ confirmNewPassword ตรงกัน
        if (newPassword !== confirmNewPassword) {
          return ResponseHandler.validationError("New passwords do not match");
        }
        
        // ค้นหา user จากฐานข้อมูล
        const userRecord = await userRepo.findById(user.id);
        
        if (!userRecord) {
          return ResponseHandler.notFound("User not found");
        }
        
        // ตรวจสอบรหัสผ่านปัจจุบัน
        let isValidPassword = false;
        try {
          isValidPassword = await Bun.password.verify(currentPassword, userRecord.password);
        } catch (err) {
          console.error("Password verification error:", err);
        }
        
        if (!isValidPassword) {
          return ResponseHandler.validationError("Current password is incorrect");
        }
        
        // เข้ารหัสรหัสผ่านใหม่
        const hashedPassword = await Bun.password.hash(newPassword);
        
        // อัพเดทรหัสผ่านในฐานข้อมูล
        await userRepo.updatePassword(user.id, hashedPassword);
        
        return ResponseHandler.success(null, "Password changed successfully");
      } catch (error: any) {
        return ResponseHandler.serverError(error.message || "Failed to change password");
      }
    },
    {
      body: changePasswordSchema,
      detail: {
        summary: 'Change password',
        description: 'Change user password with validation',
        tags: ['Authentication']
      }
    }
  )
