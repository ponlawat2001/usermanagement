import { app } from './app'
import { runMigrations } from './database/migrate'

// รันการ migrate ฐานข้อมูลก่อนเริ่มแอปพลิเคชัน
async function startServer() {
  try {
    // ทำการ migrate ฐานข้อมูล
    await runMigrations();
    
    // เริ่มเซิร์ฟเวอร์
    app.listen(3400, () => {
      console.log('🛌 User API running at http://localhost:3400')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// เริ่มการทำงาน
startServer();
