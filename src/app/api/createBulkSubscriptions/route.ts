import { NextRequest, NextResponse } from "next/server";

import xml2js from "xml2js";

import { getSession, getSessionAgent } from "@/lib/auth/session";
import { transformFeedUrltoRkey } from "@/lib/utils";

function chunkArray(array: [], size: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      return Response.json(
        {
          message: "You must be signed in to add feeds.",
        },
        { status: 401 },
      );
    }
    console.log({ agent });
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
              title: attributes.title,
              siteUrl: attributes.htmlUrl,
              feedUrl: attributes.xmlUrl,
              folder: outline.$.title,
              // feedType: feedtype,
            });
          }
        }
      } else {
        feeds.push({
          title: outline.$.title,
          siteUrl: outline.$.htmlUrl,
          feedUrl: outline.$.xmlUrl,
          // folder: outline.$.title,
          // feedType: feedtype,
        });
      }

      // if (outline.outline) {
      //   for (let subOutline of outline.outline) {
      //     feeds = feeds.concat(extractFeeds(subOutline));
      //   }
      // }
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

    console.log({ uniqueFeeds });

    // return NextResponse.json({ message: "success" });

    // atproto create records TODO:
    const bulkRecords = uniqueFeeds.map((record) => {
      let rkey;
      if (record.feedUrl.includes("youtube.com")) {
        rkey = transformFeedUrltoRkey(record.siteUrl);
      } else {
        rkey = transformFeedUrltoRkey(record.feedUrl);
      }
      return {
        $type: "com.atproto.repo.applyWrites#create" as const,
        collection: "app.pocketfeed.feed.subscription",
        rkey,
        value: {
          $type: "app.pocketfeed.feed.subscription",
          ...record,
          createdAt: new Date().toISOString(),
        },
      };
    });

    console.log({ bulkRecords });

    //TODO: types
    async function createBulkSubscriptions(records: any) {
      const batches = chunkArray(records, 10);
      // const results = [];

      const promises = [];

      for (const batch of batches) {
        promises.push(
          agent?.com.atproto.repo.applyWrites({
            repo: agent.assertDid,
            writes: [...batch],
          }),
        );

        // Optional: add a small delay to avoid rate limits
        // await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const results = await Promise.all(promises);
      console.log({ results });
    }

    await createBulkSubscriptions(bulkRecords);

    return NextResponse.json({ message: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
