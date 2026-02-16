import { InferSelectModel, sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import {
  bigint,
  boolean,
  integer,
  pgPolicy,
  pgRole,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// export const appUser = pgRole("app_user"); //TODO:

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    userId: text("user_id")
      .notNull()
      .default(sql`(auth.user_id())`),
    email: text("email").notNull().unique(),
    website: text("website"),
    bio: text("bio"),
    fullname: text("fullname"),
    birthday: text("birthday"),
    avatarUrl: text("avatar_url"),
    avatarPublicId: text("avatar_public_id"),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ],
);

export const authState = pgTable("auth_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const authSession = pgTable("auth_session", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
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

export type User = InferSelectModel<typeof users>;
