import { NextRequest, NextResponse } from "next/server";

import * as Sentry from "@sentry/nextjs";
import { nanoid } from "nanoid";
import xml2js from "xml2js";

import getSession from "@/lib/iron-session/get-iron-session";

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

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileData = buffer.toString("utf8");

    // console.log({ userId });
    function extractFeeds(outline: any) {
      let feeds = [];

      if (outline.outline) {
        for (let subOutline of outline.outline) {
          // console.log({ outline: outline.$ });
          if (subOutline.$.type === "rss") {
            const attributes = subOutline.$;
            //   const feedtype =
            //     path.extname(attributes.xmlUrl) === ".json" ? "json" : "text";
            feeds.push({
              id: nanoid(),
              title: attributes.title,
              siteUrl: attributes.htmlUrl,
              feedUrl: attributes.xmlUrl,
              // folder: outline.$.title,
              // feedType: feedtype,
            });
          }
        }
      } else {
        feeds.push({
          id: nanoid(),
          title: outline.$.title,
          siteUrl: outline.$.htmlUrl,
          feedUrl: outline.$.xmlUrl,
          // folder: outline.$.title,
          // feedType: feedtype,
        });
      }

      return feeds;
    }

    // Parse the OPML file
    let result = await xml2js.parseStringPromise(fileData);

    const feeds = [];
    for (let outline of result.opml.body[0].outline) {
      // console.log(outline);
      feeds.push(...extractFeeds(outline));
    }

    // console.log({ feeds });

    const feedUrls = new Set();

    // filter duplicate feeds
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
