import { cache } from "react";

import { getDid } from "../auth/session";

let getAllRecords = async () => {
  const did = await getDid();

  const response = await fetch(
    `https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=app.pocketfeed.feed.subscription&limit=100`,
  );

  const data = await response.json();

  return data?.records;
};

export let getProfile = cache(async () => {
  const did = await getDid();
  console.log({ did });
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`,
  );

  console.log({ res });

  if (!res.ok) {
    throw new Error("Something went wrong!");
  }

  const profile = await res.json();

  return profile;
});
