import { user } from "../schemas/user";
import { db } from "../database/database";
import { eq, and, isNull, or } from "drizzle-orm";
import { User } from "../interfaces/user";
import { createId } from "@paralleldrive/cuid2";

// สร้างฟังก์ชันเข้ารหัส password แบบง่าย
// ในโปรดักชันควรใช้ bcrypt หรือ argon2 แทน
async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 5, // ค่าความซับซ้อนของการเข้ารหัส
  });
}

export class UserRepo {
  // ดึงข้อมูล user ทั้งหมด (ไม่รวม user ที่ถูกลบ)
  async findAll() {
    try {
      const users = await db.select().from(user).where(isNull(user.deletedAt));
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  // ดึงข้อมูล user ตาม id
  async findById(id: string) {
    try {
      const [userinfo] = await db
        .select()
        .from(user)
        .where(and(eq(user.id, id), isNull(user.deletedAt)));
      return userinfo;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw new Error("Failed to fetch user");
    }
  }

  // ดึงข้อมูล user ตาม username หรือ email (สำหรับ login)
  async findByUsernameOrEmail(usernameOrEmail: string) {
    try {
      const [userinfo] = await db
        .select()
        .from(user)
        .where(
          and(
            isNull(user.deletedAt),
            eq(user.isActive, true),
            eq(user.isBanned, false),
            eq(user.isSuspend, false),
            or(
              eq(user.email, usernameOrEmail),
              eq(user.username, usernameOrEmail)
            )
          )
        );
      return userinfo;
    } catch (error) {
      console.error(
        `Error fetching user with username/email ${usernameOrEmail}:`,
        error
      );
      return null;
    }
  }

  // สร้าง user ใหม่
  async create(data: Partial<User>) {
    try {
      // เข้ารหัส password ก่อนบันทึก
      if (!data.password) {
        throw new Error("Password is required");
      }
      const hashedPassword = await hashPassword(data.password);
      const userId = createId();

      // ใช้เฉพาะ fields ที่จำเป็น ไม่รวม id ให้ database generate เอง
      const insertData = {
        id: userId,
        username: data.username ?? "",
        email: data.email ?? "",
        password: hashedPassword,
        fullname: data.fullname ?? "",
      };
      console.log("Creating user with data:", insertData);
      const createdUser = await db.insert(user).values(insertData).returning();

      return createdUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  // อัพเดทข้อมูล user
  async update(id: string, data: any) {
    // ถ้ามีการอัพเดท password ให้เข้ารหัสก่อน
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const [updatedUser] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  }

  // ลบข้อมูล user (soft delete)
  async delete(id: string) {
    await db
      .update(user)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));

    return { success: true };
  }

  // อัพเดทเฉพาะรหัสผ่านของ user
  async updatePassword(id: string | number, hashedPassword: string) {
    await db
      .update(user)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id.toString()));

    return { success: true };
  }
}
