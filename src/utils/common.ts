export class common {
    static async hashPassword(password: string): Promise<string> {
        return await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 5, // ค่าความซับซ้อนของการเข้ารหัส
        });
    }   

    static async verifyPassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        try {
            return await Bun.password.verify(password, hashedPassword);
        } catch (error) {
            console.error("Error verifying password:", error);
            return false;
        }
    }
}

