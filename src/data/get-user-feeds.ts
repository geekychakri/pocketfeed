import { cache } from "react";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getSessionAgent } from "@/lib/auth/session";
import { decryptPassword } from "@/lib/crypto";

type SubscriptionType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
}[];

type FeedbinItemType = {
  id: string;
  created_at: string;
  feed_id: number;
  title: string;
  feed_url: string;
  site_url: string;
};

export const getUserFeeds = cache(async (did: string) => {
  console.log("USER_FEEDS");

  let inAppFeedSubscriptions: SubscriptionType = [];
  let feedbinSubscriptions: SubscriptionType = [];

  const agent = await getSessionAgent();

  if (!agent?.did) {
    throw new Error("You must be signed in!");
  }

  console.log({ agentDid: agent.did });

  const [userFeedbinAccount] = await db
    .select({
      email: schema.feedbinAccounts.email,
      password: schema.feedbinAccounts.encryptedPassword,
    })
    .from(schema.feedbinAccounts)
    .where(eq(schema.feedbinAccounts.userDid, agent.did))
    .limit(1);

  let auth;
  if (userFeedbinAccount) {
    const decryptedPassword = decryptPassword(userFeedbinAccount.password);

    auth = Buffer.from(
      `${userFeedbinAccount.email}:${decryptedPassword}`,
    ).toString("base64");
  }

  const [inAppFeedsResult, feedbinResult] = await Promise.allSettled([
    db
      .select()
      .from(schema.feeds)
      .where(eq(schema.feeds.did, did as string))
      .orderBy(desc(schema.feeds.createdAt)),

    userFeedbinAccount
      ? fetch("https://api.feedbin.com/v2/subscriptions.json", {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        })
      : Promise.resolve(null),
  ]);

  if (
    inAppFeedsResult.status === "fulfilled" &&
    inAppFeedsResult.value.length >= 1
  ) {
    inAppFeedSubscriptions = inAppFeedsResult.value.map((item) => ({
      ...item,
      source: "pocketfeed",
    }));
  }

  if (feedbinResult.status === "fulfilled" && feedbinResult.value) {
    const res = feedbinResult.value;

    if (res.ok) {
      const subscriptions = await res.json();
      feedbinSubscriptions = subscriptions.map((item: FeedbinItemType) => ({
        title: item.title as string,
        feedUrl: item.feed_url as string,
        siteUrl: item.site_url,
        id: item.id,
        externalSub: true,
        source: "feedbin",
      }));
    }
  }

  return [...inAppFeedSubscriptions, ...feedbinSubscriptions];
});
