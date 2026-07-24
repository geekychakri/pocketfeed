CREATE TABLE "feedbin_accounts" (
	"user_did" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"encrypted_password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedbin_accounts" ADD CONSTRAINT "feedbin_accounts_user_did_users_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("did") ON DELETE cascade ON UPDATE no action;