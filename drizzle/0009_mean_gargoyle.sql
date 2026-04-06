CREATE TABLE "feeds" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"did" text NOT NULL,
	"title" text NOT NULL,
	"feedUrl" text NOT NULL,
	"siteUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_did_unique";--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("did");--> statement-breakpoint
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_did_users_did_fk" FOREIGN KEY ("did") REFERENCES "public"."users"("did") ON DELETE cascade ON UPDATE no action;