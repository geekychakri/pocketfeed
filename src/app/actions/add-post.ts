"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

export async function addPost(
  link: string,
  prevState: any,
  formData: FormData,
) {
  try {
    // GET did from the session

    // const { userId }: { userId: string | null } = await auth();
    // if (!userId) {
    //   return {
    //     type: "auth-error",
    //     message: "You must be signed in to update your profile!",
    //   };
    // }

    // const user = await currentUser();
    const post = formData.get("post") as string;
    // const feedItemUrl = (formData.get("feedItemUrl") as string) || "";

    // // const itemType = formData.get("type");

    const feedItem = formData.get("feedItem") as string;
    // const feedAlbumCover = formData.get("feedAlbumCover") as string;
    // const feedTitle = formData.get("feedTitle") as string;
    // const websiteLink = formData.get("websiteLink") as string;

    // console.log({ feedItem });

    // console.log({ feedAlbumCover });

    // if (link !== websiteLink) {
    //   return { type: "user-error", message: "Something doesn't look right!" };
    // }

    // const metadata = await urlMetadata(feedItemUrl);  //Check  url  is present

    // const { title = "", author = "", description = "" } = metadata;

    // console.log({ metadata });

    // await xata.db.posts.create({
    //   body: post,
    //   // feedItemUrl,
    //   // feedItemTitle: title,
    //   // feedItemDescription: description,
    //   // feedItemAuthor: author,
    //   feedItem,
    //   feedTitle,
    //   feedAlbumCover,
    //   websiteLink,
    //   username: user?.username as string,
    // });

    const data = await db.insert(schema.posts).values({
      did: "did:plc:fhhygitymqyet5inny6klful",
      text: post,
      sharedFeedItem: feedItem,
    });

    console.log({ data });

    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
