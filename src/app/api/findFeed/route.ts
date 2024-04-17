import rssFinder from "rss-finder";

import getMetaData from "metadata-scraper";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    console.log(res);
    const rssRes = await rssFinder(res.ur);
    console.log(rssRes);
    const { site, feedUrls } = rssRes;
    let rssData;
    if (feedUrls.length >= 1 && res.url.includes("youtube.com")) {
      const data = await getMetaData(res.url);
      console.log(data);
      rssData = {
        ...site,
        title: data.title,
        favicon: data.image,
        feedUrl: feedUrls[0],
      };
    } else {
      rssData = {
        ...site,
        feedUrl: feedUrls[0],
      };
    }
    console.log(rssData);
    return Response.json({ rssData });
  } catch (err) {
    return Response.json({ msg: "Something went wrong!" }, { status: 500 });
  }
}
