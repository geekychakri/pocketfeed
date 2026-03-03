import { InferSelectModel, sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import {
  bigint,
  boolean,
  index,
  integer,
  pgPolicy,
  pgRole,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const authState = pgTable("auth_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const authSession = pgTable("auth_session", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const users = pgTable("users", {
  did: text("did").unique().notNull(),
  handle: text("handle").unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const todayFeeds = pgTable("today_feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  did: text("did").notNull(),
  title: text("title"),
  feedUrl: text("feedUrl"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookmarkLink: text("bookmark_link").notNull(),
  bookmarkType: text("bookmark_type").notNull(),
  bookmarkTitle: text("bookmark_title").notNull(),
  bookmarkItem: text("bookmark_item").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    did: text("did").notNull(),
    displayName: text("display_name"),
    handle: text("handle").notNull(),
    avatar: text("avatar"),
    text: text("text").notNull(),
    sharedFeedItem: text("shared_feed_item").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("posts_author_id_idx").on(table.did, table.id)],
);

export const follows = pgTable(
  "follows",
  {
    followerDid: text("follower_did").notNull(),
    followingDid: text("following_did").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("follows_following_idx").on(table.followingDid),
    index("follows_follower_idx").on(table.followerDid),
  ],
);

export const userFeed = pgTable(
  "user_feed",
  {
    userDid: text("user_did").notNull(),
    postId: uuid("post_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userDid, table.postId] }),
    index("user_feed_user_created_idx").on(table.userDid, table.createdAt),
  ],
);

export type User = InferSelectModel<typeof users>;
