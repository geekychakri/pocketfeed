"use server";
import { redirect } from "next/navigation";
import qs from "qs";
import { nanoid } from "nanoid";

import { getXataClient } from "@/xata";

const xata = getXataClient();

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssURL: string;
  }[];
  folder: string;
  favicon: string;
};

export async function addFeeds(prevState: any, formData: FormData) {
  const results = qs.parse(
    Object.fromEntries(formData.entries()) as {},
  ) as FeedsType;
  console.log(results);
  const feedId = nanoid();
  let feeds = [];

  if (results.feeds?.length > 1) {
    feeds = results?.feeds
      .filter((item) => Boolean(item.isChecked))
      .map((item) => {
        return {
          rssURL: item?.rssURL,
          title: item?.title,
          folder: results.folder,
          favicon: results.favicon,
          username: "test", //TODO:
          feedId,
        };
      });
  } else {
    feeds = results?.feeds.map((item) => {
      return {
        rssURL: item?.rssURL,
        folder: results.folder,
        favicon: results.favicon,
        title: item?.title,
        username: "test",
        feedId,
      };
    });
  }

  console.log(feeds);
  if (!(feeds.length >= 1)) {
    return {
      message: "Select at least one feed.",
    };
  }

  const records = await xata.db.feeds.create(feeds);

  redirect(`/folder/${results.folder}`);
  console.log("DONE");
}
