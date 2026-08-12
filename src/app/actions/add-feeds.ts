"use server";

import * as Sentry from "@sentry/nextjs";
import { count, eq } from "drizzle-orm";
import qs from "qs";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";
import { upstashRedis } from "@/lib/upstash-redis";
import { addFeedSchema } from "@/lib/zod/schemas/add-feed";

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssUrl: string;
  }[];

  folder: string;
  favicon: string;
  siteUrl: string;
};

const initialState = {
  type: "",
  message: "",
  payload: [],
  did: "",
};

export async function addFeeds(prevState: any, formData: FormData | null) {
  if (formData === null) {
    return initialState;
  }
  let shouldRedirect = false;
  let feeds = [];
  try {
    const session = await getSession();

    if (!session.user?.did) {
      throw new Error("You must be signed in to add a feed.");
    }

    const did = session.user.did;

    const results = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as FeedsType;
    // const results = Object.fromEntries(formData.entries());

    // console.log({ results });

    // return;

    if (results.feeds.length > 1) {
      const checkIfFeedIsPresent = results.feeds.some(
        (item) => item.isChecked === "on",
      );

      if (!checkIfFeedIsPresent) {
        return {
          type: "error",
          message: "Select at least one feed.",
          payload: [],
        };
      }
    }

    // validate fields
    const validateFields = addFeedSchema.safeParse(results);

    console.log({ validateFields });

    if (!validateFields.success) {
      console.log(validateFields.error.flatten().fieldErrors);
      return {
        type: "error",
        message: "Please fix the errors in the form.",
        payload: [],
        errors: validateFields.error.flatten().fieldErrors,
      };
    }

    const [{ feedCount }] = await db
      .select({
        feedCount: count(),
      })
      .from(schema.feeds)
      .where(eq(schema.feeds.did, did));

    console.log({ feedCount });

    if (feedCount > 150) {
      return {
        type: "error",
        message: "You've reached the 150-feed limit.",
        payload: [],
      };
    }

    if (results.feeds?.length > 1) {
      feeds = results?.feeds
        .filter((item) => Boolean(item.isChecked))
        .map((item) => {
          return {
            did,
            feedUrl: item?.rssUrl,
            title: item?.title,
            // folder: results.folder,
            favicon: results.favicon,
            siteUrl: results.siteUrl,
          };
        });
    } else {
      feeds = results?.feeds.map((item) => {
        return {
          did,
          feedUrl: item?.rssUrl,
          // folder: results.folder,
          favicon: results.favicon,
          siteUrl: results.siteUrl,
          title: item?.title,
        };
      });
    }

    console.log(feeds);

    console.log({ feeds });
    // console.log({ title: decodeURIComponent(feeds[0].title) });

    const insertedFeedItems = await db
      .insert(schema.feeds)
      .values(feeds)
      .onConflictDoNothing()
      .returning();

    try {
      await upstashRedis.del(`daily-${session.user.did}-feed`);
    } catch (err) {
      console.error("Failed to invalidate daily feed cache:", err);
    }

    // refresh();

    console.log({ insertedFeedItems });

    const responseFeedItems = insertedFeedItems.map((item) => ({
      ...item,
      source: "pocketfeed",
    }));

    shouldRedirect = true;

    return {
      type: "success",
      message: "",
      payload: responseFeedItems,
      did,
    };
  } catch (err) {
    Sentry.captureException(err, {
      tags: { action: "add-feeds" },
    });
    return {
      type: "internal-error",
      // message: getErrorMessage(err) || INTERNAL_ERROR_MESSAGE,
      message: INTERNAL_ERROR_MESSAGE,
      payload: [],
    };
  }
}
