import crypto from "crypto";

import { LinkChecker } from "linkinator";

export async function POST(request: Request) {
  const authDate = Math.floor(Date.now() / 1000).toString();

  const res = await fetch(
    "https://api.podcastindex.org/api/1.0/episodes/byguid?guid=PC2084&feedurl=http://mp3s.nashownotes.com/pc20rss.xml&pretty",
    {
      method: "GET",
      headers: {
        "X-Auth-Key": process.env.PODCAST_INDEX_API_KEY as string,
        Authorization: crypto
          .createHash("sha1")
          .update(
            (((process.env.PODCAST_INDEX_API_KEY as string) +
              process.env.PODCAST_INDEX_SECRET) as string) +
              Math.floor(Date.now() / 1000).toString(),
          )
          .digest("hex"), // SECRETS SYMBOLS QUOTES ESCAPE
        "X-Auth-Date": authDate,
        "User-Agent": "PocketFeed/1.0",
      },
    },
  );
  const data = await res.json();
  console.log({ data });
  return Response.json("hello");
}

export async function GET() {
  const checker = new LinkChecker();
  const results = await checker.check({
    path: "https://frontendfirst.fm/favicon.ico",
  });
  console.log({ results: results.links });

  return Response.json({ msg: "hello" });
}
