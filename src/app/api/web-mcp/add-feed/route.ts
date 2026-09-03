import type { NextRequest } from "next/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { findRSS as rssFinder } from "@/lib/find-rss";
import getSession from "@/lib/iron-session/get-iron-session";
import { getYTChannelAvatar } from "@/lib/utils";
import { getFeedUrlSchema } from "@/lib/zod/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { url } = body;

  const session = await getSession();

  const did = session.user?.did;

  if (!did) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const parsedUrl = getFeedUrlSchema.safeParse(body);
  if (!parsedUrl.success) {
    return Response.json({ error: "Invalid website URL." }, { status: 400 });
  }

  try {
    const rssRes = await rssFinder(url);
    console.log(rssRes);
    const { site, feedUrls } = rssRes;
    const feedUrl = feedUrls[0];

    if (!feedUrl) {
      return Response.json(
        {
          error: "No RSS or Atom feed was found for this website.",
        },
        { status: 404 },
      );
    }

    let ytAvatar;
    if (url.includes("youtube.com")) {
      const channelId = new URL(feedUrl.url).searchParams.get(
        "channel_id",
      ) as string;
      console.log({ channelId });
      ytAvatar = await getYTChannelAvatar(channelId);
      console.log({ ytAvatar });
    }

    const rssFeed = {
      title: site.title || feedUrl.title,
      siteUrl: site.url,
      did,
      favicon: url.includes("youtube.com") ? ytAvatar : site.favicon,
      feedUrl: feedUrl.url,
    };

    console.log({ rssFeed });

    const insertedFeedItems = await db
      .insert(schema.feeds)
      .values(rssFeed)
      .onConflictDoNothing()
      .returning();

    const responseFeedItems = insertedFeedItems.map((item) => ({
      ...item,
      source: "pocketfeed",
    }));

    return Response.json(
      {
        message: "subscribed successfully!",
        payload: responseFeedItems,
        did,
        feedUrl: feedUrl.url,
      },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 },
    );
  }
}
