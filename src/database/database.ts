import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm/sql";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);

try {
  await db.execute(sql`SELECT NOW()`);
  console.log("DB Connection OK:");
} catch (error) {
  console.error("DB Connection Error:", error);
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received, closing database connection...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing database connection...");
  await pool.end();
  process.exit(0);
});
