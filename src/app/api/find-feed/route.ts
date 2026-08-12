import * as Sentry from "@sentry/nextjs";

import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { findRSS as rssFinder } from "@/lib/find-rss";
import getSession from "@/lib/iron-session/get-iron-session";
import { getYTChannelAvatar } from "@/lib/utils";
import { getFeedUrlSchema } from "@/lib/zod/schemas";

//remove duplicate feed urls from rss parser feedUrls array
function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export async function POST(request: Request) {
  try {
    const bodyRaw = await request.json();
    console.log(bodyRaw);
    const body = getFeedUrlSchema.parse(bodyRaw);
    console.log({ body });
    const { url } = body;

    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to find rss url",
        },
        { status: 401 },
      );
    }

    const rssRes = await rssFinder(url);
    console.log(rssRes);
    const { site, feedUrls } = rssRes;
    const uniqueFeedUrls = getUniqueListBy(feedUrls, "url");
    console.log(uniqueFeedUrls);
    let channelId, ytAvatar;
    if (url.includes("youtube.com")) {
      channelId = uniqueFeedUrls[0].url.split("?")[1].split("=")[1];
      console.log({ channelId });
      ytAvatar = await getYTChannelAvatar(channelId);
      console.log({ ytAvatar });
    }

    // console.log(feedUrls);
    if (feedUrls.length >= 1) {
      let rssData;
      rssData = {
        ...site,
        favicon: url.includes("youtube.com") ? ytAvatar : site.favicon,
        feedUrls: uniqueFeedUrls,
      };
      return Response.json(rssData);
    } else {
      return Response.json({});
    }
  } catch (err) {
    console.log({ err });
    Sentry.captureException(err, {
      tags: { api: "find-feed" },
    });
    if (
      err instanceof Error &&
      (err.message.includes("ENOTFOUND") ||
        err.message.includes("fetch failed"))
    ) {
      return Response.json(
        {
          message:
            "Couldn't reach that website. Please check the URL and try again.",
        },
        { status: 400 },
      );
    }
    return handleAndReturnErrorResponse(err);
  }
}
