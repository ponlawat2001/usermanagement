import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

export const user = sqliteTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: text("username").notNull().unique(),
  fullname: text("fullname").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow().notNull(),
  deletedAt: integer("deleted_at", { mode: 'timestamp' }),
  lastLogin: integer("last_login", { mode: 'timestamp' }),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  isSuspend: integer("is_suspend", { mode: 'boolean' }).notNull().default(false),
  isBanned: integer("is_banned", { mode: 'boolean' }).notNull().default(false),
  googleId: text("google_id"),
  discordId: text("discord_id"),
  githubId: text("github_id"),
  instragramId: text("instragram_id"),
});
