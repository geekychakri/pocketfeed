import { NextRequest, NextResponse } from "next/server";

import * as Sentry from "@sentry/nextjs";
import { nanoid } from "nanoid";
import xml2js from "xml2js";

import getSession from "@/lib/iron-session/get-iron-session";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

type Feed = {
  id: string;
  title: string;
  siteUrl: string | null;
  feedUrl: string;
};

function getValidHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function extractFeeds(outlines: any[]): Feed[] {
  const feeds: Feed[] = [];

  for (const outline of outlines) {
    const attributes = outline.$ ?? {};

    const feedUrl = getValidHttpUrl(attributes.xmlUrl);

    // If this outline has an xmlUrl, treat it as a feed.
    if (feedUrl) {
      feeds.push({
        id: nanoid(),
        title:
          typeof attributes.title === "string" && attributes.title.trim()
            ? attributes.title.trim()
            : feedUrl,
        siteUrl:
          typeof attributes.htmlUrl === "string" && attributes.htmlUrl.trim()
            ? attributes.htmlUrl.trim()
            : null,
        feedUrl,
      });
    }

    // An outline can be a folder containing more outlines.
    if (Array.isArray(outline.outline)) {
      feeds.push(...extractFeeds(outline.outline));
    }
  }

  return feeds;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to download subscriptions list.",
        },
        { status: 401 },
      );
    }
    const formData = await request.formData();
    const file = formData.get("opmlFile") as File;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "No OPML file uploaded." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "OPML file is too large. Max 4MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileData = buffer.toString("utf8");

    // console.log({ userId });

    // Parse the OPML file
    let result;

    try {
      result = await xml2js.parseStringPromise(fileData);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { api: "parse-opml", reason: "invalid-xml" },
      });

      return NextResponse.json(
        { message: "The OPML file contains invalid XML." },
        { status: 400 },
      );
    }

    const outlines = result?.opml?.body?.[0]?.outline;

    if (!Array.isArray(outlines)) {
      return NextResponse.json(
        { message: "Invalid OPML file." },
        { status: 400 },
      );
    }

    const feeds = extractFeeds(outlines);

    // console.log({ feeds });

    // filter duplicate feeds
    const feedUrls = new Set();
    const uniqueFeeds = feeds.filter(
      ({ feedUrl }) => !feedUrls.has(feedUrl) && feedUrls.add(feedUrl),
    );
    // .slice(0, 100);

    console.log({ uniqueFeeds });

    return NextResponse.json({ feeds: uniqueFeeds });
  } catch (err) {
    console.log(err);
    Sentry.captureException(err, {
      tags: { api: "parse-opml" },
    });
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
