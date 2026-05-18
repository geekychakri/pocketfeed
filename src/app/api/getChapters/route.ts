import crypto from "crypto";
import { type NextRequest } from "next/server";

import { LinkChecker } from "linkinator";

export async function GET(request: NextRequest) {
  try {
    // const userId = (await auth()).userId;
    // if (!userId) {
    //   return Response.json(
    //     { msg: "You must be signed in to get chapters." },
    //     { status: 401 },
    //   );
    // }
    const searchParams = request.nextUrl.searchParams;

    // const feedUrl = decodeURIComponent(searchParams.get("feedUrl") as string);

    // const podcastEpisodeGuid = searchParams.get("guid");

    // console.log({ feedUrl, podcastEpisodeGuid });

    // const authDate = Math.floor(Date.now() / 1000).toString();

    // const res = await fetch(
    //   `https://api.podcastindex.org/api/1.0/episodes/byfeedurl?url=${feedUrl}&pretty&max=5`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "X-Auth-Key": process.env.PODCAST_INDEX_API_KEY as string,
    //       Authorization: crypto
    //         .createHash("sha1")
    //         .update(
    //           (((process.env.PODCAST_INDEX_API_KEY as string) +
    //             process.env.PODCAST_INDEX_SECRET) as string) +
    //             Math.floor(Date.now() / 1000).toString(),
    //         )
    //         .digest("hex"), // SECRETS SYMBOLS QUOTES ESCAPE
    //       "X-Auth-Date": authDate,
    //       "User-Agent": "PocketFeed/1.0",
    //     },
    //   },
    // );
    // const data = await res.json();
    // console.log({ data: data.items });

    const chaptersUrl = searchParams.get("chaptersUrl") as string;
    console.log({ chaptersUrl });
    const res = await fetch(chaptersUrl);
    if (!res.ok) {
      throw new Error("");
    }
    const data = await res.json();

    return Response.json({ chapters: data.chapters });
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}

// export async function GET() {
//   const checker = new LinkChecker();
//   const results = await checker.check({
//     path: "https://frontendfirst.fm/favicon.ico",
//   });
//   console.log({ results: results.links });

//   return Response.json({ msg: "hello" });
// }
