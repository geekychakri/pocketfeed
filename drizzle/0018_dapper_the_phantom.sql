ALTER TABLE "feeds" RENAME COLUMN "feedUrl" TO "feed_url";--> statement-breakpoint
ALTER TABLE "feeds" RENAME COLUMN "siteUrl" TO "site_url";--> statement-breakpoint
ALTER TABLE "today_feeds" RENAME COLUMN "feedUrl" TO "feed_url";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "displayName" TO "display_name";--> statement-breakpoint
DROP INDEX "unique_user_feed";--> statement-breakpoint
DROP INDEX "user_feed_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_feed" ON "feeds" USING btree ("did","feed_url");--> statement-breakpoint
CREATE UNIQUE INDEX "user_feed_unique" ON "today_feeds" USING btree ("did","feed_url");