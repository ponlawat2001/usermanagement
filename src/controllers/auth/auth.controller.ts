import Elysia, { t } from "elysia";
import { ResponseHandler } from "../../utils/response.utils";
import { changePasswordSchemaUser, loginSchemaUser } from "../../validations/user.validation";
import { JwtUtils } from "../../utils/jwt.utils";
import {
  changePasswordSchemaDocs,
  loginSchemaUserDocs,
  logoutSchemaDocs,
  refreshTokenSchemaDocs,
} from "../../docs/auth.docs";
import { authProfile } from "../../interfaces/auth";
import { UserService } from "../../services/user/user.service";
import { common } from "../../utils/common";

// สร้าง schema สำหรับ refresh token
const refreshTokenSchema = t.Object({
  refreshToken: t.String({
    description: "The refresh token issued during login",
    minLength: 10,
  }),
});

const userService = new UserService();

export const AuthController = new Elysia()
  .post(
    "/login",
    async ({ body, set }) => {
      const { usernameOrEmail, password } = body;
      try {
        const user = await userService.findByUsernameOrEmail(usernameOrEmail);
        if (!user) {
          set.status = 401; // Unauthorized
          return ResponseHandler.unauthorized(
            "Invalid username/email or password"
          );
        }

        // ตรวจสอบรหัสผ่านโดยใช้ Bun.password.verify เพื่อเปรียบเทียบรหัสผ่านที่เข้ารหัสแล้ว
        let isPasswordValid = false;
        try {
          isPasswordValid = await common.verifyPassword(password, user.password);
        } catch (err) {
          console.error("Password verification error:", err);
          isPasswordValid = false;
        }

        if (!isPasswordValid) {
          set.status = 401;
          return ResponseHandler.unauthorized(
            "Invalid username/email or password"
          );
        }
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        // สร้าง JWT token และ refresh token สำหรับ user
        const { accessToken, refreshToken } = await JwtUtils.generateTokens(
          payload
        );
        // สร้าง response สำหรับการเข้าสู่ระบบสำเร็จ พร้อมกับ token
        set.status = 200; // OK
        return ResponseHandler.success(
          {
            accessToken,
            refreshToken,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role || "user",
            },
          },
          "Login successful"
        );
      } catch (error: any) {
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(error.message || "Login failed");
      }
    },
    {
      body: loginSchemaUser,
      detail: loginSchemaUserDocs,
    }
  )

  // แอนด์พอยท์สำหรับ refresh token
  .post(
    "/refresh-token",
    async ({ body, set }) => {
      try {
        const { refreshToken } = body;

        // สร้าง access token ใหม่จาก refresh token
        const result = await JwtUtils.refreshAccessToken(refreshToken);

        if (!result) {
          set.status = 401; // Unauthorized
          return ResponseHandler.unauthorized(
            "Invalid or expired refresh token"
          );
        }

        // ส่ง access token ใหม่กลับไป
        set.status = 200; // OK
        return ResponseHandler.success(
          {
            accessToken: result.accessToken,
          },
          "Token refreshed successfully"
        );
      } catch (error: any) {
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(
          error.message || "Failed to refresh token"
        );
      }
    },
    {
      body: refreshTokenSchema,
      detail: refreshTokenSchemaDocs,
    }
  )

  // แอนด์พอยท์สำหรับออกจากระบบ
  .post(
    "/logout",
    async ({ body, set }) => {
      try {
        const { refreshToken } = body;
        // ยกเลิก refresh token
        JwtUtils.revokeRefreshToken(refreshToken);

        set.status = 200; // OK
        return ResponseHandler.success(null, "Logged out successfully");
      } catch (error: any) {
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(
          error.message || "Failed to log out"
        );
      }
    },
    {
      body: refreshTokenSchema,
      detail: logoutSchemaDocs,
    }
  )

  // แอนด์พอยท์สำหรับเปลี่ยนรหัสผ่าน
  .post(
    "/change-password",
    async ({ body, user, set }: { body: any; user: authProfile; set: any }) => {
      try {
        const { currentPassword, newPassword, confirmNewPassword } = body;

        // ตรวจสอบว่า newPassword และ confirmNewPassword ตรงกัน
        if (newPassword !== confirmNewPassword) {
          return ResponseHandler.validationError("New passwords do not match");
        }

        // ค้นหา user จากฐานข้อมูล
        const userRecord = await userService.findById(user.id);

        if (!userRecord) {
          set.status = 404; // Not Found
          return ResponseHandler.notFound("User not found");
        }

        // ตรวจสอบรหัสผ่านปัจจุบัน
        let isValidPassword = false;
        try {
          isValidPassword = await common.verifyPassword(
            currentPassword,
            userRecord.password
          );
        } catch (err) {
          set.status = 500; // Internal Server Error
          console.error("Password verification error:", err);
        }

        if (!isValidPassword) {
          set.status = 400; // Bad Request
          return ResponseHandler.validationError(
            "Current password is incorrect"
          );
        }

        // อัพเดทรหัสผ่านในฐานข้อมูล
        await userService.updateUser(user.id, {
          password: newPassword,
        } as any);

        set.status = 200; // OK
        return ResponseHandler.success(null, "Password changed successfully");
      } catch (error: any) {
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(
          error.message || "Failed to change password"
        );
      }
    },
    {
      body: changePasswordSchemaUser,
      detail: changePasswordSchemaDocs,
    }
  );
