"use server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function dailyFeedsAction(formData: FormData) {
  let userId = (await auth()).userId as string;
  const data = formData.getAll("feeds");
  console.log(data);
  const feeds = data.map((item) => {
    return {
      userId,
      rssURL: JSON.parse(item).rssURL,
      title: JSON.parse(item).title,
    };
  });
  console.log(feeds);
  const records = await xata.db.daily.create(feeds as []);
  console.log("DONE");
}
