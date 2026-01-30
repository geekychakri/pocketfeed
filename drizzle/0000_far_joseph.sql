CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"user_id" text DEFAULT (auth.user_id()) NOT NULL,
	"email" text NOT NULL,
	"website" text,
	"bio" text,
	"fullname" text,
	"birthday" text,
	"avatar_url" text,
	"avatar_public_id" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "users"."user_id")) WITH CHECK ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "users"."user_id"));