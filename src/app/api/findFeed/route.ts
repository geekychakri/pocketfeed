import rssFinder from "rss-finder";

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
  const rssRes = await rssFinder(res.url);
  // console.log(data);
  const { site, feedUrls } = rssRes;
  const rssData = {
    ...site,
    feedUrl: feedUrls[0],
  };
  console.log(rssData);
  return Response.json({ rssData });
}
