import { sql } from "drizzle-orm";
import { isNull } from "drizzle-orm";
import { db } from "../../database/database";
import { User } from "../../interfaces/user";
import { user } from "../../schemas/user";
import { createId } from "@paralleldrive/cuid2";
import { common } from "../../utils/common.utils";

export class UserService {
  async findAll() {
    // เรียกใช้ repository method โดยตรง
    try {
      const users = await db.select().from(user).where(isNull(user.deletedAt));
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async findById(id: string) {
    try {
      const userinfo = await db
        .select()
        .from(user)
        .where(sql`${user.id} = ${id} AND ${user.deletedAt} IS NULL`);
      if (!userinfo || userinfo.length === 0) {
        console.warn(`User with id ${id} not found`);
        return null;
      } else {
        return userinfo[0] as unknown as User;
      }
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    try {
      const userInfo = await db
        .select()
        .from(user)
        .where(
          sql`(${user.username} = ${usernameOrEmail} OR ${user.email} = ${usernameOrEmail}) AND ${user.deletedAt} IS NULL`
        );
      if (!userInfo || userInfo.length === 0) {
        return null;
      } else {
        return userInfo[0] as unknown as User;
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch user with username or email ${usernameOrEmail}`
      );
    }
  }

  async createUser(userData: Partial<User>) {
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error("Username, email, and password are required");
      }

      // Check for existing username or email
      const existingUser = await this.findByUsernameOrEmail(userData.username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

      const existingEmail = await this.findByUsernameOrEmail(userData.email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      const hashedPassword = await common.hashPassword(userData.password ?? "");

      const createdUser = await db
        .insert(user)
        .values({
          id: createId(),
          username: userData.username ?? "",
          email: userData.email ?? "",
          password: hashedPassword,
          fullname: userData.fullname ?? "",
        })
        .returning();
      return createdUser as unknown as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      // Check for duplicate username if username is being updated
      if (userData.username) {
        const existingUserWithUsername = await this.findByUsernameOrEmail(
          userData.username
        );
        if (existingUserWithUsername && existingUserWithUsername.id !== id) {
          throw new Error("Username already exists");
        }
      }

      // Check for duplicate email if email is being updated
      if (userData.email) {
        const existingUserWithEmail = await this.findByUsernameOrEmail(
          userData.email
        );
        if (existingUserWithEmail && existingUserWithEmail.id !== id) {
          throw new Error("Email already exists");
        }
      }

      const hashedPassword = await common.hashPassword(userData.password ?? "");
      if (userData.password) {
        userData.password = hashedPassword;
      }

      const updatedUser = await db
        .update(user)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(sql`${user.id} = ${id}`)
        .returning();
      return updatedUser as unknown as User | null;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new Error(`Failed to update user with id ${id}`);
    }
  }

  async deleteUser(id: string) {
    try {
      await db
        .update(user)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(sql`${user.id} = ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error(`Failed to delete user with id ${id}`);
    }
  }
}
