import "server-only";

import { cache } from "react";

import Parser from "rss-parser";

import { getSelectedFeeds } from "@/db/queries";
import { getSession } from "@/lib/auth/session";

const parser = new Parser();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3);

const today = new Date();
today.setHours(0, 0, 0, 0);

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      {
        message: "You must be signed in to view your daily feed list.",
      },
      {
        status: 401,
      },
    );
  }
  const feedItems = [];

  // const userId = (await auth()).userId as string;

  // const feedList = await xata.db.daily
  //   .filter({ userId })
  //   .select(["rssURL", "title"])
  //   .getAll();

  const feedList = await getSelectedFeeds();

  console.log({ feedList });

  const feedSources = feedList.map((item) => {
    return {
      feedUrl: item.feedUrl,
      title: item.title,
    };
  });

  // console.log({ feedSources });

  const data = await Promise.allSettled(
    feedSources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.feedUrl as string);
        const latestFeed = feed.items.splice(0, 10).map((item) => {
          return {
            ...item,
            feedUrl: source.feedUrl,
          };
        });
        // console.log({ latestFeed });
        latestFeed.forEach((item) => {
          const date = item.pubDate ? new Date(item.pubDate) : undefined;
          if (date && date >= today)
            //TODO:
            feedItems.push({
              // feed: feed.title,
              // title: item.title,
              // link: item.link,
              // date,
              ...item,
              date,
              // ...(item.feedUrl === source.rssUrl && {
              //   feedTitle: source.title,
              // }),
              feedUrl: item.feedUrl,
              feedTitle: source.title,
              ...(item.enclosure?.url && {
                feedListMetaData: {
                  itunes: {
                    ...feed.tunes,
                  },
                  link: feed.link,
                  title: source.title,
                  image: {
                    ...feed.image,
                  },
                },
              }),
            });
        });
      } catch (error) {
        console.error(`Error fetching feed from ${source.feedUrl}:`, error);
      }
    }),
  );

  // return feedItems;

  return Response.json({ feedItems });
}
