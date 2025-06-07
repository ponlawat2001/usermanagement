import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
export const db = drizzle(process.env.DATABASE_URL!);

try {
  await db.execute(sql`SELECT NOW()`);
  console.log("DB Connection OK:");
} catch (error) {
  console.error("DB Connection Error:", error);
}
