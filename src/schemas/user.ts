import {
  boolean,
  pgTable,
  text,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    username: text("username"),
    fullname: text("fullname"),
    password: text("password"),
    email: text("email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    lastLogin: timestamp("last_login"),
    isActive: boolean("is_active").notNull().default(true),
    isSuspend: boolean("is_suspend").notNull().default(false),
    isBanned: boolean("is_banned").notNull().default(false),
    googleId: text("google_id"),
    discordId: text("discord_id"),
    githubId: text("github_id"),
    instagramId: text("instagram_id"),
    role: text("role").notNull().default("user"),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(table.email),
    uniqueIndex("usernameUniqueIndex").on(table.username),
  ],
);
