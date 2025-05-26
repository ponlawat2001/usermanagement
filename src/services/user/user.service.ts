import { User } from "../../interfaces/user"
import { UserRepo } from "../../repositories/user.repo"

export class UserService {
    constructor(private userRepo: UserRepo = new UserRepo()) {}

    async findAll(): Promise<User[] | []> {
        // เรียกใช้ repository method โดยตรง
        try {
            const users = await this.userRepo.findAll();
            return users as User[];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
    
    async findById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepo.findById(id);
            return user as User | null;
        } catch (error) {
            console.error(`Error fetching user with id ${id}:`, error);
            return null;
        }
    }
    
    async createUser(userData: any): Promise<User | {}> {
        try {
            // เรียกใช้ repository method โดยตรง
            const createdUser = await this.userRepo.create(userData);
            return createdUser as User; 
        } catch (error) {
            console.error('Error creating user:', error);
            return {};
        }
    }
    
    async updateUser(id: string, userData: any): Promise<User | null> {
        try {
            const updatedUser = await this.userRepo.update(id, userData);
            return updatedUser as User | null;
        } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            return null;
        }
    }
    
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await this.userRepo.delete(id);
            return result.success;
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            return false;
        }
    }
}
