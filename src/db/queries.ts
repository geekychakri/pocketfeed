import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "./db";
import * as schema from "./schema";

export const getSelectedFeeds = cache(async () => {
  console.log("Getting selected Feeds.");
  //TODO: filter by user id
  return db.select().from(schema.todayFeeds);
});

export const getBookmarks = async () => {
  "use cache";
  cacheLife("hours"); //TODO:
  cacheTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks");
  return db.select().from(schema.bookmarks);
};

export const getAllRecordsFromDb = async (did: string) => {
  return db.select().from(schema.feeds).where(eq(schema.feeds.did, did));
};
