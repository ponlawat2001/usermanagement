import { table } from "../schemas/schema";
import { db } from "../database/database";
import { eq, and, isNull, or } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// สร้างฟังก์ชันเข้ารหัส password แบบง่าย
// ในโปรดักชันควรใช้ bcrypt หรือ argon2 แทน
async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password,  {
    algorithm: "bcrypt",
    cost: 5, // ค่าความซับซ้อนของการเข้ารหัส
  });
}

export class UserRepo {

  // ดึงข้อมูล user ทั้งหมด (ไม่รวม user ที่ถูกลบ)
  async findAll() {
    try {
      const users = await db
        .select()
        .from(table.user)
        .where(isNull(table.user.deletedAt));
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  // ดึงข้อมูล user ตาม id
  async findById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(table.user)
        .where(and(eq(table.user.id, id), isNull(table.user.deletedAt)));
      return user;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw new Error("Failed to fetch user");
    }
  }

  // ดึงข้อมูล user ตาม username หรือ email (สำหรับ login)
  async findByUsernameOrEmail(usernameOrEmail: string) {
    try {
      const [user] = await db
        .select()
        .from(table.user)
        .where(
          and(
            isNull(table.user.deletedAt),
            eq(table.user.isActive, true),
            eq(table.user.isBanned, false),
            eq(table.user.isSuspend, false),
            or(
              eq(table.user.email, usernameOrEmail),
              eq(table.user.username, usernameOrEmail)
            )
          )
        );
      return user;
    } catch (error) {
      console.error(
        `Error fetching user with username/email ${usernameOrEmail}:`,
        error
      );
      return null;
    }
  }

  // สร้าง user ใหม่
  async create(data: any) {
    try {
      // เข้ารหัส password ก่อนบันทึก
      const hashedPassword = await hashPassword(data.password);

      const [user] = await db
        .insert(table.user)
        .values({
          id: createId(),
          username: data.username,
          fullname: data.fullname,
          password: hashedPassword,
          email: data.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        })
        .returning();

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  // อัพเดทข้อมูล user
  async update(id: string, data: any) {
    try {
      // ถ้ามีการอัพเดท password ให้เข้ารหัสก่อน
      if (data.password) {
        data.password = await hashPassword(data.password);
      }

      // เพิ่ม updatedAt timestamp
      data.updatedAt = new Date();

      const [updatedUser] = await db
        .update(table.user)
        .set(data)
        .where(eq(table.user.id, id))
        .returning();

      return updatedUser;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new Error("Failed to update user");
    }
  }

  // ลบข้อมูล user (soft delete)
  async delete(id: string) {
    try {
      await db
        .update(table.user)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(table.user.id, id));

      return { success: true };
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error("Failed to delete user");
    }
  }
  
  // อัพเดทเฉพาะรหัสผ่านของ user
  async updatePassword(id: string | number, hashedPassword: string) {
    try {
      await db
        .update(table.user)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(table.user.id, id.toString()));

      return { success: true };
    } catch (error) {
      console.error(`Error updating password for user with id ${id}:`, error);
      throw new Error("Failed to update password");
    }
  }
}
