/** @format */

import { app } from './app'

async function startServer() {
  try {
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
startServer()
