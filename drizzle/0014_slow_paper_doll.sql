ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_did_following_did_pk" PRIMARY KEY("follower_did","following_did");--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "displayName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text NOT NULL;