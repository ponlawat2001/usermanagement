/** @format */

import { app } from './app'

async function startServer() {
  try {
    const startTime = Date.now()
    console.log(`🚀 Server starting...`)

    const port = process.env.PORT || 3400
    app.listen(port, () => {
      const duration = Date.now() - startTime
      console.log(`🛌 User API running at http://localhost:${port} (started in ${duration}ms)`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}
// เริ่มการทำงาน
startServer()
