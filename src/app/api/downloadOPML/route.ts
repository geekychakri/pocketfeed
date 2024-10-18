import xml2js from "xml2js";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function GET(request: Request) {
  const user = await currentUser();
  console.log({ user });
  const feeds = await xata.db.feeds
    .filter({ username: user?.username })
    .getAll(); //TODO: getAll or getMany or filter by userId
  console.log({ feeds });

  function createOPML(feeds: any) {
    const opmlObject = {
      opml: {
        $: { version: "1.0" },
        head: {
          title: "Feed Reader Subscriptions",
        },
        body: {
          outline: {
            $: { text: "Feeds", title: "Feeds" },
            outline: feeds.map((feed: any) => ({
              $: {
                type: "rss",
                text: feed.title,
                title: feed.title,
                xmlUrl: feed.xmlUrl,
                htmlUrl: feed.htmlUrl,
              },
            })),
          },
        },
      },
    };

    // Create XML from the JavaScript object using xml2js.Builder
    const builder = new xml2js.Builder({ headless: true });
    return builder.buildObject(opmlObject);
  }

  const opmlData = createOPML(feeds);

  return Response.json({ opml: opmlData });
}
