import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';

export const user = pgTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: text("username").notNull().unique(),
  fullname: text("fullname").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  isSuspend: boolean("is_suspend").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  googleId: text("google_id"),
  discordId: text("discord_id"),
  githubId: text("github_id"),
  instragramId: text("instragram_id"),
  role: text("role").notNull().default("user"),
});
