import * as Sentry from "@sentry/nextjs";
import xml2js from "xml2js";

import { getUserFeeds } from "@/data/get-user-feeds";
import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
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

    const feeds = await getUserFeeds(session.user.did);

    function createOPML(feeds: any) {
      const opmlObject = {
        opml: {
          $: { version: "1.0" },
          head: {
            title: "Your Pocket Feed Subscriptions",
            dateCreated: new Date().toString(),
          },
          body: {
            outline: feeds.map(
              (feed: { title: string; rssUrl: string; siteUrl: string }) => ({
                $: {
                  type: "rss",
                  text: feed.title,
                  title: feed.title,
                  xmlUrl: feed.rssUrl,
                  htmlUrl: feed.siteUrl,
                },
              }),
            ),
          },
        },
      };

      // Create XML from the JavaScript object using xml2js.Builder
      const builder = new xml2js.Builder({ headless: true });
      return builder.buildObject(opmlObject);
    }

    const opmlData = createOPML(feeds);

    return Response.json({ opml: opmlData }, { status: 200 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { api: "download-opml" },
    });
    return Response.json("", { status: 500 });
  }
}
