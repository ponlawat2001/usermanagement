import { boolean, date, pgTable, varchar } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';

export const user = pgTable("user", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: varchar("username").notNull().unique(),
  fullname: varchar("fullname").notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at").defaultNow().notNull(),
  deletedAt: date("deleted_at"),
  lastLogin: date("last_login"),
  isActive: boolean("is_active").notNull().default(true),
  isSuspend: boolean("is_suspend").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  googleId: varchar("google_id"),
  discordId: varchar("discord_id"),
  githubId: varchar("github_id"),
  instragramId: varchar("instragram_id"),
  role: varchar("role").default("user"),
});
