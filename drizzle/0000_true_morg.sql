CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"fullname" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"last_login" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_suspend" boolean DEFAULT false NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"google_id" text,
	"discord_id" text,
	"github_id" text,
	"instagram_id" text,
	"role" text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "usernameUniqueIndex" ON "user" USING btree ("username");