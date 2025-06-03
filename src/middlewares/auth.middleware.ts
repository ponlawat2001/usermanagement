import Elysia from "elysia";
import { ResponseHandler } from "../utils/response.utils";
import { JwtUtils } from "../utils/jwt.utils";
import { user } from "../schemas/user";
import { authProfile } from "../interfaces/auth";

/**
 * ตรวจสอบว่าผู้ใช้ได้ยืนยันตัวตนแล้วหรือไม่ (มี valid JWT token)
 */
export const extractUser = async ({
  headers,
  jwt,
}: {
  headers: any;
  jwt: any;
}) => {
  // Decode JWT ครั้งเดียว และเก็บไว้ใน context
  const token = headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return { user: null };
  }
  try {
    const payload = await jwt.verify(token);
    if (payload) {
      return {
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.username,
          role: payload.role,
        } as unknown as authProfile,
      };
    }
    return { user: null };
  } catch (error) {
    return { user: null };
  }
};

export const requireAuth = (user: authProfile) => {
  if (!user) {
    return ResponseHandler.unauthorized("Authentication required");
  }
};

/**
 * ตรวจสอบว่าผู้ใช้มี role ที่กำหนดหรือไม่
 */
export const requireRole = async (user: authProfile, role: string) => {
  // if (!user) {
  //   return ResponseHandler.unauthorized("Authentication required");
  // }
  if (user.role !== role && user.role !== "admin") {
    return ResponseHandler.forbidden(
      "You do not have permission to access this resource"
    );
  }
};
