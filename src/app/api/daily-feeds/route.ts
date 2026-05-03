import { after } from "next/server";

import pLimit from "p-limit";
import Parser from "rss-parser";

import { getUserFeeds } from "@/db/queries";
import { getSession } from "@/lib/auth/session";
import { upstashRedis } from "@/lib/upstash-redis";
import type { FeedItemType } from "@/types";

const parser = new Parser({
  customFields: {
    item: ["podcast:chapters", "podcast:transcript"],
  },
});

const limit = pLimit(10);

const today = new Date();
today.setHours(0, 0, 0, 0);

export async function GET(request: Request) {
  try {
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

    const userFeeds = await getUserFeeds(session.sub);

    console.log({ userFeeds });

    if (userFeeds.length === 0) {
      return Response.json({ dailyFeedItems: [], userHasFeeds: false });
    }

    const getUserDailyFeed = await upstashRedis.get(
      `daily-${session.did}-feed`,
    );

    if (getUserDailyFeed) {
      console.log("GOT DAILY FEED CACHE");
      return Response.json({
        dailyFeedItems: getUserDailyFeed,
        userHasFeeds: true,
      });
    }

    const tasks = userFeeds.map((feed) =>
      limit(async () => {
        const cachedFeed: any = await upstashRedis.get(feed.feedUrl);

        if (cachedFeed) {
          const elapsedSeconds = (Date.now() - cachedFeed.lastChecked) / 1000;
          if (elapsedSeconds < 3600) {
            console.log("SERVED FROM CACHE");

            const latestFeed = cachedFeed.items
              // .slice(0, 10)
              .sort(
                (a: { isoDate: string }, b: { isoDate: string }) =>
                  new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
              )
              .flatMap((item: FeedItemType) => {
                const date = item.pubDate ? new Date(item.pubDate) : undefined;
                if (date && date >= today) {
                  return {
                    ...item,
                    feedTitle: feed.title,
                    date: item.pubDate ? new Date(item.pubDate) : undefined,
                    feedUrl: feed.feedUrl,
                    ...(item.enclosure?.url && {
                      feedListMetadata: {
                        itunes: {
                          ...feedData.itunes,
                        },
                        link: feedData.link,
                        title: feed.title,
                        image: {
                          ...feedData.image,
                        },
                      },
                    }),
                  };
                } else {
                  return [];
                }
              });
            return latestFeed;
          }
        }
        console.log("FETCH REQUEST");
        console.log({ etag: cachedFeed?.etag });
        console.log({ lastModified: cachedFeed?.lastModified });
        const headers: Record<string, string> = {};
        if (cachedFeed?.etag) {
          headers["If-None-Match"] = cachedFeed.etag;
        }
        if (cachedFeed?.lastModified) {
          headers["If-Modified-Since"] = cachedFeed.lastModified;
        }

        const res = await fetch(feed.feedUrl, {
          headers,
          signal: AbortSignal.timeout(5000),
        });

        if (res.status === 304) {
          const updated = { ...cachedFeed, lastChecked: Date.now() };
          console.log("DATA not modified.");
          after(async () => {
            await upstashRedis.set(feed.feedUrl, JSON.stringify(updated), {
              ex: 86400,
            });
          });

          const latestFeed = cachedFeed.items
            // .slice(0, 10)
            .sort(
              (a: { isoDate: string }, b: { isoDate: string }) =>
                new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
            )
            .flatMap((item: FeedItemType) => {
              const date = item.pubDate ? new Date(item.pubDate) : undefined;
              if (date && date >= today) {
                return {
                  ...item,
                  feedTitle: feed.title,
                  date: item.pubDate ? new Date(item.pubDate) : undefined,
                  feedUrl: feed.feedUrl,
                  ...(item.enclosure?.url && {
                    feedListMetadata: {
                      itunes: {
                        ...feedData.itunes,
                      },
                      link: feedData.link,
                      title: feed.title,
                      image: {
                        ...feedData.image,
                      },
                    },
                  }),
                };
              } else {
                return [];
              }
            });
          return latestFeed;

          // return cachedFeed;
        }
        if (!res.ok) {
          return [];
        }

        const etag = res.headers.get("etag");
        const lastModified = res.headers.get("last-modified");

        const text = await res.text();
        const feedData = await parser.parseString(text);

        const getFirstTenFeedItems = JSON.parse(
          JSON.stringify(feedData),
        ).items.slice(0, 10);

        const newFeedData = {
          ...feedData,
          items: [...getFirstTenFeedItems],
          feedUrl: feed.feedUrl,
          etag,
          lastModified,
          lastChecked: Date.now(),
        };
        after(async () => {
          await upstashRedis.set(feed.feedUrl, JSON.stringify(newFeedData), {
            ex: 86400,
          });
        });

        const latestFeed = getFirstTenFeedItems
          .sort(
            (a: { isoDate: string }, b: { isoDate: string }) =>
              new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
          )
          .flatMap((item: FeedItemType) => {
            const date = item.pubDate ? new Date(item.pubDate) : undefined;
            if (date && date >= today) {
              return {
                ...item,
                feedTitle: feed.title,
                date: item.pubDate ? new Date(item.pubDate) : undefined,
                feedUrl: feed.feedUrl,
                ...(item.enclosure?.url && {
                  feedListMetadata: {
                    itunes: {
                      ...feedData.itunes,
                    },
                    link: feedData.link,
                    title: feed.title,
                    image: {
                      ...feedData.image,
                    },
                  },
                }),
              };
            } else {
              return [];
            }
          });
        return latestFeed || [];
        // return feedData.items.slice(0, 10);
      }),
    );

    console.log({ tasks });

    const results = await Promise.allSettled(tasks);

    const resultsArr = results.map((result, i) => {
      if (result.status === "fulfilled") {
        return Array.isArray(result.value) ? result.value : [];
      }

      return [];
    });

    after(async () => {
      await upstashRedis.set(
        `daily-${session.did}-feed`,
        JSON.stringify(resultsArr),
        {
          ex: 3600,
        },
      );
    });

    console.log({ resultsArr: resultsArr });

    return Response.json({ dailyFeedItems: resultsArr, userHasFeeds: true });
  } catch (err) {
    return Response.json({}, { status: 500 });
  }
}
