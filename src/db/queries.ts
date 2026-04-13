import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";

import { eq } from "drizzle-orm";

import { getSession } from "@/lib/auth/session";

import { db } from "./db";
import * as schema from "./schema";

export const getSelectedFeeds = cache(async () => {
  const session = await getSession();
  console.log("Getting selected Feeds.");
  //TODO: filter by user id
  return db
    .select()
    .from(schema.todayFeeds)
    .where(eq(schema.todayFeeds.did, session?.did as string));
});

export const getBookmarks = async () => {
  // "use cache";
  // cacheLife("hours"); //TODO:
  // cacheTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks");
  return db.select().from(schema.bookmarks);
};

export const getUserFeeds = cache(async () => {
  const session = await getSession();
  return db
    .select()
    .from(schema.feeds)
    .where(eq(schema.feeds.did, session?.did as string));
});
