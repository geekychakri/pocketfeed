"use server";
import { redirect } from "next/navigation";
import qs from "qs";

import { getXataClient } from "@/xata";

const xata = getXataClient();

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssURL: string;
  }[];
  folder: string;
};

export async function addFeeds(prevState: any, formData: FormData) {
  const results = qs.parse(
    Object.fromEntries(formData.entries()) as {},
  ) as FeedsType;
  console.log(results);
  let feeds = [];
  if (results.feeds?.length > 1) {
    feeds = results?.feeds
      .filter((item) => Boolean(item.isChecked))
      .map((item) => {
        return {
          rssURL: item?.rssURL,
          folder: results.folder,
          title: item?.title,
          username: "test", //TODO:
        };
      });
  } else {
    feeds = results?.feeds.map((item) => {
      return {
        rssURL: item?.rssURL,
        folder: results.folder,
        title: item?.title,
        username: "test",
      };
    });
  }

  console.log(feeds);
  if (!(feeds.length >= 1)) {
    return {
      message: "Select at least one feed.",
    };
  }
  // const records = await xata.db.feeds.create(feeds);
  console.log("DONE");
}
