import { User } from "../../interfaces/user";
import { UserRepo } from "../../repositories/user.repo";

export class UserService {
  constructor(private userRepo: UserRepo = new UserRepo()) {}

  async findAll(): Promise<User[] | []> {
    // เรียกใช้ repository method โดยตรง
    try {
      const users = await this.userRepo.findAll();
      return users as unknown as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        console.warn(`User with id ${id} not found`);
        return null;
      } else {
        return user as unknown as User;
      }
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  }

  async createUser(userData: Partial<User>): Promise<User | {}> {
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error("Username, email, and password are required");
      }
      // Check for duplicate username or email
      const duplicateUser = await this.userRepo.findByUsernameOrEmail(
        userData.username
      );

      // Check for duplicate username or email
      const duplicateEmail = await this.userRepo.findByUsernameOrEmail(
        userData.email
      );

      if (duplicateUser) {
        console.warn(
          `User with username ${userData.username} or email ${userData.email} already exists`
        );
        throw new Error(
          `duplicate user with username ${userData.username}`
        );
      }

      if (duplicateEmail) {
        console.warn(
          `User with email ${userData.email} already exists`
        );
        throw new Error(
          `duplicate user with email ${userData.email}`
        );
      }
      
      // เรียกใช้ repository method โดยตรง
      const createdUser = await this.userRepo.create(userData);
      return createdUser;
    } catch (error) {
      console.error("Service error creating user:", error);
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async updateUser(id: string, userData: any): Promise<User | null> {
    try {
      const updatedUser = await this.userRepo.update(id, userData);
      return updatedUser as unknown as User | null;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new Error(`Failed to update user with id ${id}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepo.delete(id);
      return result.success;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error(`Failed to delete user with id ${id}`);
    }
  }
}
