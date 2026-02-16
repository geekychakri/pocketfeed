"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db/db";
// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";

export async function dailyFeedsAction(formData: FormData) {
  // let userId = (await auth()).userId as string;
  // const data = formData.getAll("feeds");
  // console.log(data);
  // const feeds = data.map((item) => {
  //   return {
  //     userId,
  //     rssURL: JSON.parse(item).rssURL,
  //     title: JSON.parse(item).title,
  //   };
  // });
  // console.log(feeds);
  // const records = await xata.db.daily.create(feeds as []);
  // console.log("DONE");

  //TODO: add auth check

  const did = await getDid();

  console.log({ did });

  const data = formData.getAll("feeds");
  console.log(data);

  const feeds = data.map((item) => {
    return {
      did,
      title: JSON.parse(item as string).title,
      feedUrl: JSON.parse(item as string).feedUrl,
    };
  });

  console.log({ feeds });

  const response = await db.insert(schema.todayFeeds).values(feeds);

  console.log("Success!", response);
}
