"use server";

import { cache } from "react";
import { after } from "next/server";

import { desc, eq } from "drizzle-orm";
import Parser from "rss-parser";

import { getSession } from "@/lib/auth/session";
import { getKVItem, setKVItem } from "@/lib/cloudflare-kv";

import { db } from "./db";
import * as schema from "./schema";

const parser = new Parser({
  customFields: {
    item: ["podcast:chapters"],
  },
});

export const getSelectedFeeds = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  console.log("Getting selected Feeds.");
  //TODO: filter by user id
  return db
    .select()
    .from(schema.todayFeeds)
    .where(eq(schema.todayFeeds.did, session?.did as string));
});

const getBookmarks = cache(async () => {
  // "use cache";
  // cacheLife("hours"); //TODO:
  // cacheTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks");
  const session = await getSession();
  if (!session) {
    return null;
  }
  return db
    .select()
    .from(schema.bookmarks)
    .where(eq(schema.bookmarks.did, session?.did as string));
});

const getUserFeeds = cache(async (did: string) => {
  // const session = await getSession();
  if (!did) {
    return [];
  }
  return db
    .select()
    .from(schema.feeds)
    .where(eq(schema.feeds.did, did as string))
    .orderBy(desc(schema.feeds.createdAt));
});
