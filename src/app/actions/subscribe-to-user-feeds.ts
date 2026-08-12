"use server";

import * as Sentry from "@sentry/nextjs";
import { inArray, sql } from "drizzle-orm";
import qs from "qs";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

const initialState = {
  type: "",
  message: "",
  payload: [],
};

export async function subscribeToUserFeeds(
  prevState: any,
  formData: FormData | null,
) {
  try {
    if (formData === null) {
      return initialState;
    }

    const session = await getSession();
    if (!session.user?.did) {
      return {
        type: "error",
        message: "You must be signed in to delete a feed.",
        payload: [],
      };
    }
    const { feedIdList } = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as {
      feedIdList: {};
    };
    if (!feedIdList) {
      return {
        type: "user-error",
        message: "Select at least one feed.",
        payload: [],
      };
    }
    const idList = Object.values(feedIdList) as string[];
    const result = await db.execute(sql`
      INSERT INTO ${schema.feeds} (
        did,
        title,
        feed_url,
        site_url,
        favicon
      )
      SELECT
        ${session.user.did},
        title,
        feed_url,
        site_url,
        favicon
      FROM ${schema.feeds}
      WHERE ${inArray(schema.feeds.id, idList)}
      ON CONFLICT (did, feed_url) DO NOTHING
      RETURNING
          id,
          did,
          title,
          feed_url AS "feedUrl",
          site_url AS "siteUrl",
          created_at AS "createdAt",
          favicon
    `);
    console.log({ result: result.rows });
    const records = result.rows.map((record) => ({
      ...record,
      source: "pocketfeed",
    }));
    return {
      type: "success",
      message: "Subscribed successfully!",
      payload: records,
    };
  } catch (err) {
    Sentry.captureException(err, {
      tags: { action: "subscribe-to-user-feeds" },
    });
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      payload: [],
    };
  }
}
