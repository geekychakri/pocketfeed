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

export const getBookmarks = cache(async () => {
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

export const getUserFeeds = cache(async (did: string) => {
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

export const getFeedData = async (feedUrl: string) => {
  try {
    const cachedFeed = await getKVItem(feedUrl);

    if (cachedFeed) {
      const elapsedSeconds = (Date.now() - cachedFeed.lastChecked) / 1000;
      if (elapsedSeconds < 3600) {
        console.log("SERVED FROM CACHE");
        return cachedFeed;
      }
    }

    console.log({ etag: cachedFeed?.etag });
    console.log({ lastModified: cachedFeed?.lastModified });
    const headers: Record<string, string> = {};
    if (cachedFeed?.etag) {
      headers["If-None-Match"] = cachedFeed.etag;
    }
    if (cachedFeed?.lastModified) {
      headers["If-Modified-Since"] = cachedFeed.lastModified;
    }

    const res = await fetch(feedUrl, {
      headers,
    });

    console.log({ res });

    if (res.status === 304) {
      const updated = { ...cachedFeed, lastChecked: Date.now() };
      after(async () => {
        await setKVItem(feedUrl, JSON.stringify(updated));
      });

      return cachedFeed;
    }
    if (!res.ok) {
      throw new Error("ERRRRRRRRRRRRR");
    }

    const etag = res.headers.get("etag");
    const lastModified = res.headers.get("last-modified");

    const fetchData = await res.text();
    // const feed = await parser.parseURL(feedUrl);
    const feedList = await parser.parseString(fetchData);

    // stringify and parse to counter serialization error object null prototype
    const sortFirstTenFeedsByDate = JSON.parse(
      JSON.stringify(feedList),
    ).items.slice(0, 10);
    // .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1));

    const newFeedData = {
      ...feedList,
      items: [...sortFirstTenFeedsByDate],
      feedUrl,
      etag,
      lastModified,
      lastChecked: Date.now(),
    };
    after(async () => {
      await setKVItem(feedUrl, JSON.stringify(newFeedData));
    });
    return newFeedData;
  } catch (err) {
    throw new Error(err);
  }
};
