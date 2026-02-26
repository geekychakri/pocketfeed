ALTER TABLE "posts" RENAME COLUMN "username" TO "display_name";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "handle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";