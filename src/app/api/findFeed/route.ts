import rssFinder from "rss-finder";
import getMetaData from "metadata-scraper";

import { getFeedUrlSchema } from "@/lib/zod/schemas";
import { handleAndReturnErrorResponse } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const bodyRaw = await request.json();
    const body = getFeedUrlSchema.parse(bodyRaw);
    const { url } = body;
    const rssRes = await rssFinder(url);
    console.log(rssRes);
    const { site, feedUrls } = rssRes;
    if (feedUrls.length >= 1) {
      let rssData;
      const data = await getMetaData(url);
      rssData = {
        ...site,
        title: data.title,
        favicon: url.includes("youtube.com") ? data.image : data.icon,
        feedUrl: feedUrls[0],
      };
      return Response.json(rssData);
    } else {
      return Response.json({});
    }
  } catch (err) {
    return handleAndReturnErrorResponse(err);
  }
}
