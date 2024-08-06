// import rssFinder from 'rss-finder';
// import { findRSS } from "@/lib/find-rss";
import { findRSS as rssFinder } from "@/lib/find-rss";

import getMetaData from "metadata-scraper";

import { getFeedUrlSchema } from "@/lib/zod/schemas";
import { handleAndReturnErrorResponse } from "@/lib/api/errors";

//remove duplicate feed urls from rss parser feedUrls array
function getUniqueListBy(arr: [], key: string) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export async function POST(request: Request) {
  // try {
  const bodyRaw = await request.json();
  console.log(bodyRaw);
  const body = getFeedUrlSchema.parse(bodyRaw);
  const { url } = body;

  const rssRes = await rssFinder(url);
  console.log(rssRes);
  const { site, feedUrls } = rssRes;
  const uniqueFeedUrls = getUniqueListBy(feedUrls, "url");
  console.log(uniqueFeedUrls);
  // console.log(feedUrls);
  if (feedUrls.length >= 1) {
    let rssData;
    // const data = await getMetaData(url);
    // console.log(data);
    rssData = {
      ...site,
      // title: site.title,
      favicon: url.includes("youtube.com") ? site.image : site.favicon,
      feedUrls: uniqueFeedUrls,
    };
    return Response.json(rssData);
  } else {
    return Response.json({});
  }
  // } catch (err) {
  //   return handleAndReturnErrorResponse(err);
  // }
}
