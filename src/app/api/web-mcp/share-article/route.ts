import type { NextRequest } from "next/server";

import { AppBskyFeedPost, RichText } from "@atproto/api";

import { getSessionAgent } from "@/lib/auth/session";
import getSession from "@/lib/iron-session/get-iron-session";
import { getMetaTags } from "@/lib/metatags";
import { getYoutubeVideoId, isYouTubeUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { url, comment: text } = await request.json();

    const session = await getSession();

    const agent = await getSessionAgent();

    if (!agent || !session.user?.did) {
      return Response.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    console.log({ did: agent?.assertDid });

    console.log({ text });

    let rt;
    if (!text) {
      rt = new RichText({
        text: `${url}\n\nvia @pocketfeed.at`,
      });
    } else {
      rt = new RichText({
        text: `${text}\n\n${url}\n\nvia @pocketfeed.at`,
      });
    }

    await rt.detectFacets(agent);

    console.log({ rtText: rt.text });
    console.log({ facets: rt.facets?.[0].index });
    console.log({ features: rt.facets?.[0].features });

    const metatags = await getMetaTags(url);

    console.log({ metatags });

    let thumb;

    try {
      let res;
      if (isYouTubeUrl(url)) {
        const videoId = getYoutubeVideoId(url);
        console.log({ videoId });
        if (!videoId) {
          throw new Error("Unable to determine YouTube video ID");
        }
        res = await fetch(
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          {
            signal: AbortSignal.timeout(5000),
          },
        );
      } else {
        if (!metatags.image) {
          throw new Error("No image URL found in metadata");
        }
        res = await fetch(metatags.image, {
          signal: AbortSignal.timeout(5000),
        });
      }

      console.log({ res });

      if (!res.ok) {
        throw new Error(`Unable to download the image - ${res.status}`);
      }
      const imageRawData = await res.arrayBuffer();

      const imageData = new Uint8Array(imageRawData);

      const upload = await agent?.uploadBlob(imageData, {
        encoding: res.headers.get("content-type") ?? "image/jpeg",
      });

      thumb = upload.data.blob;
    } catch (err) {
      console.error(err);
    }

    const description: string = isYouTubeUrl(url) ? "" : metatags.description;

    const postRecord = {
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: rt.facets,
      embed: {
        $type: "app.bsky.embed.external",
        external: {
          uri: url,
          title: metatags.title,
          description,
          ...(thumb && { thumb }),
        },
      },
      createdAt: new Date().toISOString(),
    } satisfies AppBskyFeedPost.Record;

    await agent.post(postRecord);

    return Response.json({ message: "success" }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
