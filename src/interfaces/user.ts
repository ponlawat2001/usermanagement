export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLogin: Date | null;
  isActive: boolean;
  isSuspend: boolean;
  isBanned: boolean;
  googleId: string | null;
  discordId: string | null;
  githubId: string | null;
  instragramId: string | null;
  role?: string; // เพิ่ม role สำหรับการจัดการสิทธิ์ (optional เพื่อรองรับข้อมูลเดิม)
}
