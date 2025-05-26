import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { sqlite, db } from './database';
import { table } from '../schemas/schema';

// Function สำหรับการรัน migrations แบบที่รันครั้งเดียวตอนเริ่มแอพพลิเคชัน
export async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    // ทำการสร้างตารางตาม schema ที่กำหนดไว้
    // วิธีนี้เหมาะสำหรับโปรเจคขนาดเล็กหรือในช่วงพัฒนา
    // สำหรับโปรเจคใหญ่ควรใช้ Drizzle Kit CLI สำหรับการจัดการ migrations

    // เช็คว่าตาราง user มีอยู่หรือไม่ ถ้าไม่มีให้สร้าง
    const tableExists = sqlite.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='user'"
    ).get();

    if (!tableExists) {
      console.log('📊 Creating user table...');
      
      // สร้าง SQL สำหรับสร้างตาราง user
      const createTableSQL = sqlite.prepare(`
        CREATE TABLE IF NOT EXISTS user (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          fullname TEXT NOT NULL,
          password TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
          deleted_at INTEGER,
          last_login INTEGER,
          is_active INTEGER NOT NULL DEFAULT 1,
          is_suspend INTEGER NOT NULL DEFAULT 0,
          is_banned INTEGER NOT NULL DEFAULT 0,
          google_id TEXT,
          discord_id TEXT,
          github_id TEXT,
          instragram_id TEXT
        )
      `);
      
      createTableSQL.run();
      console.log('✅ User table created successfully!');
    } else {
      console.log('✅ User table already exists');
    }
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

// ทำการรัน migrations ถ้าเรียกไฟล์นี้โดยตรง
if (import.meta.path === Bun.main) {
  await runMigrations();
  console.log('✅ All migrations completed!');
  process.exit(0);
}