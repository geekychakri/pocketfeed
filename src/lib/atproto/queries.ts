// "use server";

import { cache } from "react";

import { getDid, getSessionAgent } from "../auth/session";

// const cache = new LRUCache<string, any>({
//   max: 1000,
//   ttl: 15 * 60 * 1000, // 15 minutes // TODO:
// });

export let getAllRecords = async () => {
  // "use cache";
  // cacheLife("hours");
  // cacheTag("user-did:plc:fhhygitymqyet5inny6klful");
  // const did = await getDid();

  // const cached = cache.get(did as string);
  // if (cached) return cached;
  // console.log("Cache not ran!");

  const response = await fetch(
    "https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=did:plc:fhhygitymqyet5inny6klful&collection=app.pocketfeed.feed.subscription&limit=100",
    {
      cache: "force-cache",
    },
  );
  // console.log({ response });

  const data = await response.json();
  // const agent = await getSessionAgent();

  // const response = await agent?.com.atproto.repo.listRecords({
  //   repo: agent.assertDid,
  //   collection: "app.pocketfeed.feed.subscription",
  //   limit: 100, //TODO:
  // });

  const feeds = data.records;

  // console.log({ feeds });

  // console.log({ feed: feeds?.[0].value });

  // cache.set(did as string, feeds);

  return data?.records;
};

export let getFeedsByFolder = async (folder: string) => {
  const records = await getAllRecords();

  const feedsByFolder = records.filter(
    (record) => record.value.folder === folder,
  );

  return feedsByFolder;
};

export let getFolderList = async () => {
  const records = await getAllRecords();

  if (records.length === 0) {
    //TODO:
    return ["Home"];
  }

  const folderList = [...new Set(records.map((record) => record.value.folder))];

  return folderList;
};

export let getProfile = cache(async () => {
  const did = await getDid();
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1 day
      },
    },
  ); //TODO: actor pass dynamic did

  const profile = await res.json();

  return profile;
});
