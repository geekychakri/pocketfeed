import { after, type NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";
import Parser from "rss-parser";

import { findRSS as rssFinder } from "@/lib/find-rss";
import getSession from "@/lib/iron-session/get-iron-session";
import { upstashRedis } from "@/lib/upstash-redis";

const parser = new Parser({
  customFields: {
    item: [
      ["podcast:chapters", "podcast:chapters"],
      ["podcast:transcript", "podcast:transcript", { keepArray: true }],
    ],
  },
});

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return Response.json({ error: "url is required." }, { status: 400 });
  }

  try {
    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          error: "You must be signed in to view the feed.",
        },
        { status: 401 },
      );
    }

    const rssRes = await rssFinder(url);
    console.log(rssRes);
    const { feedUrls } = rssRes;

    if (!feedUrls?.length) {
      return Response.json(
        { error: "No RSS or Atom feed could be found at this URL." },
        { status: 404 },
      );
    }

    const feedUrl = feedUrls[0].url;

    const cachedFeed: any = await upstashRedis.get(feedUrl);

    // converts to webmcp specific data
    const toWebMcpData = (feedData: any) => ({
      articles: feedData.items.slice(0, 10).map((item: any) => ({
        title: item.title,
        url: item.link,
        feed: item.title,
        publishedAt: item.isoDate
          ? new Date(item.isoDate).toISOString()
          : item.pubDate
            ? new Date(item.pubDate).toISOString()
            : undefined,
      })),
    });

    if (cachedFeed) {
      const elapsedSeconds = (Date.now() - cachedFeed.lastChecked) / 1000;
      if (elapsedSeconds < 3600) {
        console.log("SERVED FROM CACHE");

        return Response.json(toWebMcpData(cachedFeed));
      }
    }

    console.log({ etag: cachedFeed?.etag });
    console.log({ lastModified: cachedFeed?.lastModified });
    const headers: Record<string, string> = {};
    if (cachedFeed?.etag) {
      headers["If-None-Match"] = cachedFeed.etag;
    }
    if (cachedFeed?.lastModified) {
      headers["If-Modified-Since"] = cachedFeed.lastModified;
    }

    const res = await fetch(feedUrl, {
      headers,
      signal: AbortSignal.timeout(20000),
    });

    console.log({ res });

    if (res.status === 304) {
      const updated = { ...cachedFeed, lastChecked: Date.now() };
      console.log("DATA not modified.");
      after(async () => {
        await upstashRedis.set(feedUrl, JSON.stringify(updated), { ex: 86400 });
      });

      return Response.json(toWebMcpData(cachedFeed));
    }
    if (!res.ok) {
      if (cachedFeed)
        return Response.json({ ...toWebMcpData(cachedFeed), isStale: true });
      console.log("ERRRRRRRRRRRRR");
      throw new Error("Something went wrong!");
    }

    const etag = res.headers.get("etag");
    const lastModified = res.headers.get("last-modified");

    const fetchData = await res.text();
    // const feed = await parser.parseURL(feedUrl);
    const feedList = await parser.parseString(fetchData);

    // stringify and parse to counter serialization error object null prototype
    const sortFirstTenFeedsByDate = JSON.parse(
      JSON.stringify(feedList),
    ).items.slice(0, 10);
    // .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1));

    const newFeedData = {
      ...feedList,
      items: [...sortFirstTenFeedsByDate],
      feedUrl,
      etag,
      lastModified,
      lastChecked: Date.now(),
    };

    after(async () => {
      await upstashRedis.set(feedUrl, JSON.stringify(newFeedData), {
        ex: 86400,
      });
    });
    return Response.json(toWebMcpData(newFeedData));
  } catch (err: unknown) {
    console.log({ err });

    Sentry.captureException(err, {
      tags: { api: "get-feed-data" },
    });
    if (
      err instanceof Error &&
      (err.cause instanceof Error
        ? err.cause.message.includes("unable")
        : false || err.name === "TimeoutError")
    ) {
      return Response.json(
        { error: "unable to fetch the feed." },
        { status: 502 },
      );
    }

    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
