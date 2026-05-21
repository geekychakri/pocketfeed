import { after, NextResponse, type NextRequest } from "next/server";

import Parser from "rss-parser";

import { getKVItem, setKVItem } from "@/lib/cloudflare-kv";
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feedUrl = searchParams.get("feedUrl") as string;

  // let cachedFeed;
  // let feedList;

  try {
    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to view the feed.",
        },
        { status: 401 },
      );
    }
    // const cachedFeed = await getKVItem(feedUrl);
    const cachedFeed: any = await upstashRedis.get(feedUrl);

    if (cachedFeed) {
      const elapsedSeconds = (Date.now() - cachedFeed.lastChecked) / 1000;
      if (elapsedSeconds < 3600) {
        console.log("SERVED FROM CACHE");
        return Response.json(cachedFeed);
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
      signal: AbortSignal.timeout(5000),
    });

    console.log({ res });

    if (res.status === 304) {
      const updated = { ...cachedFeed, lastChecked: Date.now() };
      console.log("DATA not modified.");
      after(async () => {
        await upstashRedis.set(feedUrl, JSON.stringify(updated), { ex: 86400 });
      });

      return Response.json(cachedFeed);
    }
    if (!res.ok) {
      if (cachedFeed) return Response.json({ ...cachedFeed, isStale: true });
      console.log("ERRRRRRRRRRRRR");
      throw new Error("Something went wrong!");
      // if (feedUrl.includes("youtube.com")) {
      //   throw new Error("Looks like YouTube feeds are temporarily unavailable. Please check back shortly.")

      // } else if (error.message === "unable to verify the first certificate") {
      //   message = "Unable to access this feed.";
      // } else {
      //   message = "Something went wrong but don't fret — it's not your fault.";
      // }
    }

    const etag = res.headers.get("etag");
    const lastModified = res.headers.get("last-modified");

    const fetchData = await res.text();
    // const feed = await parser.parseURL(feedUrl);
    const feedList = await parser.parseString(fetchData);

    // stringify and parse to counter serialization error object null prototype
    const sortFirstTenFeedsByDate = JSON.parse(
      JSON.stringify(feedList),
    ).items.slice(0, 50);
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
    return Response.json(newFeedData);
  } catch (err) {
    console.log({ err });
    // console.log({ errMessage: err.cause.message });
    if (
      err?.cause?.message.includes("unable") ||
      err?.name === "TimeoutError"
    ) {
      // fallback strategy
      return Response.json(
        { message: "unable to fetch the feed." },
        { status: 502 },
      );
    }
    return Response.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
