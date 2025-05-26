import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from '../schemas/schema';

// สร้าง SQLite connection
const sqlite = new Database("mydbsqlite.db", { create: true, readwrite: true });

// สร้าง Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

// Export database connection สำหรับใช้สำหรับ migrations
export { sqlite };
