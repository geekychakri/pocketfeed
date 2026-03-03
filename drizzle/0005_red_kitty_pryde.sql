CREATE TABLE "user_feed" (
	"user_did" text NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_feed_user_did_post_id_pk" PRIMARY KEY("user_did","post_id")
);
--> statement-breakpoint
CREATE INDEX "user_feed_user_created_idx" ON "user_feed" USING btree ("user_did","created_at");--> statement-breakpoint
CREATE INDEX "follows_following_idx" ON "follows" USING btree ("following_did");--> statement-breakpoint
CREATE INDEX "follows_follower_idx" ON "follows" USING btree ("follower_did");--> statement-breakpoint
CREATE INDEX "posts_author_created_idx" ON "posts" USING btree ("did","created_at");