import rssFinder from "rss-finder";
import getMetaData from "metadata-scraper";

import { getFeedUrlSchema } from "@/lib/zod/schemas";
import { handleAndReturnErrorResponse } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const bodyRaw = await request.json();
    console.log(bodyRaw);
    const body = getFeedUrlSchema.parse(bodyRaw);
    const { url } = body;

    const rssRes = await rssFinder(url);
    console.log(rssRes);
    const { site, feedUrls } = rssRes;
    if (feedUrls.length >= 1) {
      let rssData;
      // const data = await getMetaData(url);
      // console.log(data);
      rssData = {
        ...site,
        // title: site.title,
        favicon: url.includes("youtube.com") ? site.image : site.favicon,
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
