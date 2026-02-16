CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bookmark_link" text NOT NULL,
	"bookmark_type" text NOT NULL,
	"bookmark_title" text NOT NULL,
	"bookmark_item" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
