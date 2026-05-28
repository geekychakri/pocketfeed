import { NextRequest } from "next/server";

import { AtUri } from "@atproto/api";
import { nanoid } from "nanoid";

import { getUserFeeds } from "@/data/get-user-feeds";
import { getSessionAgent } from "@/lib/auth/session";

type SubscriptionType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
}[];

export async function GET(request: NextRequest) {
  try {
    // let standardSiteSubscriptions: SubscriptionType = [];
    // let skyFeedSubscriptions: SubscriptionType = [];
    // let inAppFeedSubscriptions: SubscriptionType = [];

    // const agent = await getSessionAgent();

    // if (!agent?.did) {
    //   return Response.json(
    //     {
    //       message: "You must be signed in to view your daily feed list.",
    //     },
    //     {
    //       status: 401,
    //     },
    //   );
    // }

    // const [standardSiteResult, skyReaderResult, inAppFeedsResult] =
    //   await Promise.allSettled([
    //     agent?.com.atproto.repo.listRecords({
    //       repo: agent.did as string,
    //       collection: "site.standard.graph.subscription",
    //     }),
    //     agent?.com.atproto.repo.listRecords({
    //       repo: agent.did as string,
    //       collection: "app.skyreader.feed.subscription",
    //     }),

    //     getUserFeeds(agent.did),
    //   ]);

    // if (
    //   standardSiteResult.status === "fulfilled" &&
    //   standardSiteResult.value.data.records.length >= 1
    // ) {
    //   const getPublications = standardSiteResult.value.data.records.map(
    //     (record) => {
    //       const atUri = new AtUri(record.value.publication as string);
    //       return {
    //         repo: atUri.hostname,
    //         collection: atUri.collection,
    //         rkey: atUri.rkey,
    //       };
    //     },
    //   );

    //   console.log({ getPublications });

    //   const pdsCache = new Map<string, string>();

    //   const publicationRecords = await Promise.allSettled(
    //     getPublications.map(async (pub) => {
    //       let pdsEndpoint = pdsCache.get(pub.repo);

    //       if (!pdsEndpoint) {
    //         const plcRes = await fetch(
    //           `https://plc.directory/${pub.repo}/data`,
    //         );

    //         if (!plcRes.ok) return null;

    //         const plcData = await plcRes.json();

    //         pdsEndpoint = plcData?.services?.atproto_pds?.endpoint;

    //         if (!pdsEndpoint) return null;

    //         pdsCache.set(pub.repo, pdsEndpoint);
    //       }

    //       const params = new URLSearchParams({
    //         repo: pub.repo,
    //         collection: pub.collection,
    //         rkey: pub.rkey,
    //       });

    //       const res = await fetch(
    //         `${pdsEndpoint}/xrpc/com.atproto.repo.getRecord?${params}`,
    //       );

    //       if (!res.ok) return null;

    //       return res.json();
    //     }),
    //   );

    //   standardSiteSubscriptions = publicationRecords
    //     .filter(
    //       (item): item is PromiseFulfilledResult<any> =>
    //         item.status === "fulfilled" && !!item.value,
    //     )
    //     .map((item) => item.value)
    //     .map((item) => ({
    //       id: item.cid,
    //       title: item.value.name,
    //       feedUrl: `${item.value.url}/feed`,
    //       siteUrl: item.value.url,
    //     }));
    // }

    // if (
    //   skyReaderResult.status === "fulfilled" &&
    //   skyReaderResult.value.data.records.length >= 1
    // ) {
    //   skyFeedSubscriptions = skyReaderResult.value.data.records.map(
    //     (record) => {
    //       return {
    //         title: record.value.title as string,
    //         feedUrl: record.value.feedUrl as string,
    //         siteUrl: (record.value.siteUrl ||
    //           new URL(record.value.feedUrl as string).origin) as string,
    //         id: nanoid(),
    //       };
    //     },
    //   );
    // }

    // if (
    //   inAppFeedsResult.status === "fulfilled" &&
    //   inAppFeedsResult.value.length >= 1
    // ) {
    //   inAppFeedSubscriptions = inAppFeedsResult.value;
    // }

    const feeds = await getUserFeeds();

    return Response.json(feeds);
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
