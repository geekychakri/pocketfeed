import { cache } from "react";

import { AtUri } from "@atproto/api";
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
  console.log("USER_FEEDs");
  let standardSiteSubscriptions: SubscriptionType = [];
  let skyFeedSubscriptions: SubscriptionType = [];
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

  const [standardSiteResult, skyReaderResult, inAppFeedsResult, feedbinResult] =
    await Promise.allSettled([
      agent?.com.atproto.repo.listRecords({
        repo: did as string,
        collection: "site.standard.graph.subscription",
        limit: 100, // limit to 100
      }),
      agent?.com.atproto.repo.listRecords({
        repo: did as string,
        collection: "app.skyreader.feed.subscription",
        limit: 100, // limit to 100
      }),

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
    standardSiteResult.status === "fulfilled" &&
    standardSiteResult.value.data.records.length >= 1
  ) {
    // skip standard site subscription records without a publication field.
    const getPublications = standardSiteResult.value.data.records.flatMap(
      (record) => {
        if (typeof record.value.publication !== "string") {
          console.warn("skipping the record", record.uri);
          return [];
        }

        const atUri = new AtUri(record.value.publication);

        return [
          {
            repo: atUri.hostname,
            collection: atUri.collection,
            rkey: atUri.rkey,
          },
        ];
      },
    );

    console.log({ getPublications });

    const pdsCache = new Map<string, string>();

    const publicationRecords = await Promise.allSettled(
      getPublications.map(async (pub) => {
        let pdsEndpoint = pdsCache.get(pub.repo);

        if (!pdsEndpoint) {
          const plcRes = await fetch(`https://plc.directory/${pub.repo}/data`);

          if (!plcRes.ok) return null;

          const plcData = await plcRes.json();

          pdsEndpoint = plcData?.services?.atproto_pds?.endpoint;

          if (!pdsEndpoint) return null;

          pdsCache.set(pub.repo, pdsEndpoint);
        }

        const params = new URLSearchParams({
          repo: pub.repo,
          collection: pub.collection,
          rkey: pub.rkey,
        });

        const res = await fetch(
          `${pdsEndpoint}/xrpc/com.atproto.repo.getRecord?${params}`,
        );

        if (!res.ok) return null;

        return res.json();
      }),
    );

    standardSiteSubscriptions = publicationRecords
      .filter(
        (item): item is PromiseFulfilledResult<any> =>
          item.status === "fulfilled" && !!item.value,
      )
      .map((item) => item.value)
      .map((item) => {
        // console.log({ item });
        return {
          id: item.cid,
          title: item.value.name || item.value.url,
          feedUrl: `${item.value.url}/${item.value.theme["$type"].includes("leaflet") ? "rss" : "feed"}`,
          siteUrl: item.value.url,
          externalSub: true,
          source: "standard.site",
        };
      });
  }

  if (
    skyReaderResult.status === "fulfilled" &&
    skyReaderResult.value.data.records.length >= 1
  ) {
    skyFeedSubscriptions = skyReaderResult.value.data.records.map((record) => {
      return {
        title: record.value.title as string,
        feedUrl: record.value.feedUrl as string,
        siteUrl: (record.value.siteUrl ||
          new URL(record.value.feedUrl as string).origin) as string,
        id: record.cid,
        externalSub: true,
        source: "skyreader",
      };
    });
  }

  const filteredSkyFeedSubscriptions = skyFeedSubscriptions.filter(
    ({ title, siteUrl }) =>
      !standardSiteSubscriptions.some(
        (item) => item.title === title || item.siteUrl === siteUrl,
      ),
  );

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

  return [
    ...inAppFeedSubscriptions,
    ...standardSiteSubscriptions,
    ...filteredSkyFeedSubscriptions,
    ...feedbinSubscriptions,
  ];
});
