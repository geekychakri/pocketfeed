"use server";

import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";
import { upstashRedis } from "@/lib/upstash-redis";

type ItemType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
};

type AddOPMLFeedsResult =
  | {
      type: "success";
      message: string;
      did: string;
      feeds: (typeof schema.feeds.$inferSelect & {
        source: string;
      })[];
    }
  | {
      type: "auth-error" | "validation-error" | "internal-error";
      message: string;
    };

export async function addOPMLFeeds(
  data: ItemType[],
): Promise<AddOPMLFeedsResult> {
  try {
    // throw new Error("");
    const session = await getSession();

    const did = session.user?.did;
    if (!did) {
      return {
        type: "auth-error",
        message: "Authentication required.",
      };
    }

    if (data.length === 0) {
      return {
        type: "validation-error",
        message: "Select at least one feed.",
      };
    }

    if (data.length > 150) {
      return {
        type: "validation-error",
        message: "Only up to 150 feeds can be imported.",
      };
    }

    const result = await db
      .select({
        feedUrl: schema.feeds.feedUrl,
      })
      .from(schema.feeds)
      .where(eq(schema.feeds.did, did));

    console.log({ result });

    const existingFeedUrls = new Set(result.map((item) => item.feedUrl));

    const uniqueFeeds = data.filter(
      (item) => !existingFeedUrls.has(item.feedUrl),
    );

    if (uniqueFeeds.length === 0) {
      return {
        type: "validation-error",
        message: "You’re already subscribed to all selected feeds.",
      };
    }

    if (result.length + uniqueFeeds.length > 150) {
      return {
        type: "validation-error",
        message: "You can only have 150 feeds.",
      };
    }

    const feedList = uniqueFeeds.map((item: ItemType) => ({
      ...item,
      did,
    }));
    console.log({ feedList });

    const insertedData = await db
      .insert(schema.feeds)
      .values(feedList)
      .onConflictDoNothing()
      .returning();

    const insertedDataWithSource = insertedData.map((item) => ({
      ...item,
      source: "pocketfeed",
    }));

    try {
      await upstashRedis.del(`daily-${did}-feed`);
    } catch (err) {
      console.error("Failed to invalidate daily feed cache:", err);
    }

    // refresh();
    return {
      type: "success",
      message: "success",
      did,
      feeds: insertedDataWithSource,
    };
  } catch (err) {
    Sentry.captureException(err, {
      tags: { action: "add-opml-feeds" },
    });
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
