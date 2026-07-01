"use server";

import { AppBskyFeedPost, RichText } from "@atproto/api";
import { sql } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid, getSessionAgent } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";
import { getMetaTags } from "@/lib/metatags";

const initialState = {
  type: "",
  message: "",
  postText: "",
};

export async function addPost(prevState: any, formData: FormData | null) {
  if (formData === null) {
    return initialState;
  }
  let text = "";
  try {
    console.log("RAN TXN");

    const did = (await getDid()) as string;

    const session = await getSession();

    const agent = await getSessionAgent();

    if (!agent || !session.user?.did) {
      return {
        message: "Authentication required.",
      };
    }

    console.log({ did: agent?.assertDid });

    const { handle, avatar, displayName } = session.user;

    text = formData.get("post") as string;
    const feedItem = formData.get("feedItem") as string;

    console.log({ feedItem: JSON.parse(feedItem) });

    const parsedFeedItem = JSON.parse(feedItem);

    const rt = new RichText({
      text: `${text}\n\n${parsedFeedItem.link}\n\nvia @pocketfeed.at`,
    });

    await rt.detectFacets(agent);

    console.log({ rtText: rt.text });
    console.log({ facets: rt.facets?.[0].index });
    console.log({ features: rt.facets?.[0].features });

    const metatags = await getMetaTags(parsedFeedItem.link);

    console.log({ metatags });

    let thumb;

    try {
      let res;
      if (parsedFeedItem.link.includes("www.youtube.com")) {
        const videoId = parsedFeedItem?.id?.split(":")?.[2];
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

    const description: string = parsedFeedItem.link.includes("www.youtube.com")
      ? `YouTube video by ${parsedFeedItem.author}`
      : metatags.description;

    const postRecord = {
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: rt.facets,
      embed: {
        $type: "app.bsky.embed.external",
        external: {
          uri: parsedFeedItem.link,
          title: parsedFeedItem.title,
          description,
          ...(thumb && { thumb }),
        },
      },
      createdAt: new Date().toISOString(),
    } satisfies AppBskyFeedPost.Record;

    const result = await agent.post(postRecord);

    const bskyPostRkey = result.uri.split("/").pop() as string;

    const d = await db.transaction(async (tx) => {
      const [post] = await tx
        .insert(schema.posts)
        .values({
          did,
          displayName,
          handle,
          avatar,
          text,
          bskyPostRkey,
          sharedFeedItem: feedItem,
        })
        .returning();

      //add to author own feed
      await tx.insert(schema.userFeed).values({
        userDid: did,
        postId: post.id,
      });

      await tx.execute(sql`
      insert into ${schema.userFeed} (user_did, post_id, created_at)
      select ${schema.follows.followerDid}, ${sql.param(post.id)}, now()
      from ${schema.follows}
      where ${schema.follows.followingDid} = ${did}
      on conflict do nothing
    `);
    });

    return { type: "success", message: "success" };
  } catch (err) {
    console.error(err);
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      postText: text,
    };
  }
}
