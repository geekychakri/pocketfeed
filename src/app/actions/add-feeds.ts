"use server";

import { refresh, revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { TID } from "@atproto/common";
import LZString from "lz-string";
import { nanoid } from "nanoid";
import qs from "qs";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { validateRecord } from "@/lexicon/types/app/pocketfeed/feed/subscription";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
// import { getXataClient } from "@/xata";

import getSession from "@/lib/iron-session/get-iron-session";
import { getErrorMessage, transformFeedUrltoRkey } from "@/lib/utils";
import { addFeedSchema } from "@/lib/zod/schemas/add-feed";

// const xata = getXataClient();

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssUrl: string;
  }[];
  // folder: string;
  // newFolder: string;
  folder: string;
  favicon: string;
  siteUrl: string;
};

// export async function addFeeds(prevState: any, formData: FormData) {
//   let results: FeedsType;
//   let shouldRedirect: boolean;
//   let userId: string;
//   try {
//     userId = (await auth()).userId as string;

//     if (!userId) {
//       throw new Error("You must be signed in to add a feed!");
//     }
//     const user = await currentUser();
//     console.log({ username: user?.username });
//     results = qs.parse(
//       Object.fromEntries(formData.entries()) as {},
//     ) as FeedsType;
//     // console.log({ results });

//     const validateFields = addFeedSchema.safeParse(results);
//     // console.log({ validateFields });
//     // console.log({ feeds: validateFields.data?.feeds });

//     // console.log({ error: validateFields.error?.flatten().fieldErrors });

//     if (!validateFields.success) {
//       console.log(validateFields.error.flatten().fieldErrors);
//       return {
//         type: "error",
//         message: "Please fix the errors in the form.",
//         errors: validateFields.error.flatten().fieldErrors,
//       };
//     }

//     console.log({ results });

//     if (results.feeds.length > 1) {
//       const checkIfFeedIsPresent = results.feeds.some(
//         (item) => item.isChecked === "on",
//       );

//       if (!checkIfFeedIsPresent) {
//         return {
//           type: "error",
//           message: "Select at least one feed.",
//         };
//       }
//     }

//     let feeds = [];

//     console.log({ feeds: results.feeds });

//     if (results.feeds?.length > 1) {
//       feeds = results?.feeds
//         .filter((item) => Boolean(item.isChecked))
//         .map((item) => {
//           return {
//             rssURL: item?.rssURL,
//             title: item?.title,
//             // folder: results.folder,
//             favicon: results.favicon,
//             siteURL: results.siteURL,
//             username: user?.username, //TODO:
//             feedId: nanoid(),
//             userId,
//           };
//         });
//     } else {
//       feeds = results?.feeds.map((item) => {
//         return {
//           rssURL: item?.rssURL,
//           // folder: results.folder,
//           favicon: results.favicon,
//           siteURL: results.siteURL,
//           title: item?.title,
//           username: user?.username,
//           feedId: nanoid(),
//           userId,
//         };
//       });
//     }

//     // console.log({ feeds });

//     //CHECK IF FEED EXISTS //TODO: SPLIT IT
//     const rssUrls = feeds.map((feed) => feed.rssURL);

//     // console.log(rssUrls);

//     const existingRecords = await xata.db.feeds
//       .filter({
//         userId,
//         rssURL: { $any: rssUrls },
//       })
//       .getAll();

//     // console.log({ existingRecords });

//     const existingRssUrls = new Set(
//       existingRecords.map((record) => record.rssURL),
//     );

//     // If user adds multiple feeds filter out the existing feeds from the list and check whether the filtered list item is already present
//     const uniqueRecords = feeds.filter(
//       (record) => !existingRssUrls.has(record.rssURL),
//     );
//     console.log({ uniqueRecords });

//     if (uniqueRecords.length >= 1) {
//       if (results.newFolder) {
//         const folderExists = await xata.db.folders
//           .filter({ userId, folder: { $iContains: results.newFolder } })
//           .getFirst();

//         if (folderExists) {
//           return { message: "Folder with this name already exists." };
//         }

//         const newFolder = await xata.db.folders.create({
//           userId,
//           folder: results.newFolder,
//           username: user?.username as string,
//         });
//         const newFeeds = uniqueRecords.map((feed) => ({
//           ...feed,
//           folderName: {
//             id: newFolder.id,
//             userId,
//             folder: results.folder,
//             username: user?.username as string,
//           },
//         }));
//         const records = await xata.db.feeds.create(newFeeds as []);
//         shouldRedirect = true;
//         // redirect(`/folder/${results.newFolder}`); //TODO:
//         console.log("DONE");
//       } else {
//         const folder = await xata.db.folders
//           .filter({ userId, folder: results.folder })
//           .getFirst();

//         const newFeeds = uniqueRecords.map((feed) => ({
//           ...feed,
//           folderName: {
//             id: folder?.id,
//             userId,
//             folder: folder?.folder,
//             username: user?.username as string,
//           },
//         }));

//         console.log({ newFeeds });

//         const records = await xata.db.feeds.create(newFeeds as []);

//         shouldRedirect = true;
//         // redirect(`/folder/${results.folder}`); //TODO:
//       }
//     } else {
//       return { type: "error", message: "Feed already exists!" };
//     }
//   } catch (err) {
//     return {
//       type: "internal-error",
//       message: INTERNAL_ERROR_MESSAGE,
//     };
//   }

//   if (shouldRedirect) {
//     revalidateTag(`${userId}-${results.folder || results.newFolder}`, "max");
//     redirect(`/folder/${results.folder || results.newFolder}`);
//   }
// }

const initialState = {
  type: "",
  message: "",
  payload: [],
};

export async function addFeeds(prevState: any, formData: FormData | null) {
  if (formData === null) {
    return initialState;
  }
  let shouldRedirect = false;
  let feeds = [];
  try {
    const session = await getSession();

    if (!session.user?.did) {
      throw new Error("You must be signed in to add a feed.");
    }

    const did = session.user.did;

    const results = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as FeedsType;
    // const results = Object.fromEntries(formData.entries());

    // console.log({ results });

    // return;

    if (results.feeds.length > 1) {
      const checkIfFeedIsPresent = results.feeds.some(
        (item) => item.isChecked === "on",
      );

      if (!checkIfFeedIsPresent) {
        return {
          type: "error",
          message: "Select at least one feed.",
          payload: [],
        };
      }
    }

    // validate fields
    const validateFields = addFeedSchema.safeParse(results);

    console.log({ validateFields });

    if (!validateFields.success) {
      console.log(validateFields.error.flatten().fieldErrors);
      return {
        type: "error",
        message: "Please fix the errors in the form.",
        payload: [],
        errors: validateFields.error.flatten().fieldErrors,
      };
    }

    if (results.feeds?.length > 1) {
      feeds = results?.feeds
        .filter((item) => Boolean(item.isChecked))
        .map((item) => {
          return {
            did,
            feedUrl: item?.rssUrl,
            title: item?.title,
            // folder: results.folder,
            favicon: results.favicon,
            siteUrl: results.siteUrl,
          };
        });
    } else {
      feeds = results?.feeds.map((item) => {
        return {
          did,
          feedUrl: item?.rssUrl,
          // folder: results.folder,
          favicon: results.favicon,
          siteUrl: results.siteUrl,
          title: item?.title,
        };
      });
    }

    console.log(feeds);

    // let response;

    // if (feeds.length > 1) {
    //   const bulkRecords = feeds.map((record) => {
    //     let rkey;
    //     if (record.feedUrl.includes("youtube.com")) {
    //       rkey = transformFeedUrltoRkey(record.siteUrl);
    //     } else {
    //       rkey = transformFeedUrltoRkey(record.feedUrl);
    //     }

    //     return {
    //       $type: "com.atproto.repo.applyWrites#create" as const,
    //       collection: "app.pocketfeed.feed.subscription",
    //       rkey,
    //       value: {
    //         $type: "app.pocketfeed.feed.subscription",
    //         ...record,
    //         createdAt: new Date().toISOString(),
    //       },
    //     };
    //   });
    //   // const bulkRecords1 = [
    //   //   {
    //   //   $type: "com.atproto.repo.applyWrites#create" as const,
    //   //   collection: "xyz.pocketfeed.status",
    //   //   value: {
    //   //     status: "hello-from-pocket-feed-1",
    //   //     createdAt: new Date().toISOString(),
    //   //   },
    //   // },
    //   // {
    //   //   $type: "com.atproto.repo.applyWrites#create" as const,
    //   //   collection: "xyz.pocketfeed.status",
    //   //   value: {
    //   //     status: "hello-from-pocket-feed-2",
    //   //     createdAt: new Date().toISOString(),
    //   //   },
    //   // },
    //   // ]
    //   response = await agent?.com.atproto.repo.applyWrites({
    //     repo: agent.assertDid,
    //     writes: [...bulkRecords],
    //   });
    // } else {
    //   let rkey;
    //   if (feeds[0].feedUrl.includes("youtube.com")) {
    //     rkey = transformFeedUrltoRkey(feeds[0].siteUrl);
    //   } else {
    //     rkey = transformFeedUrltoRkey(feeds[0].feedUrl);
    //   }

    //   response = await agent?.com.atproto.repo.putRecord({
    //     repo: agent.assertDid,
    //     collection: "app.pocketfeed.feed.subscription",
    //     rkey,
    //     record: {
    //       $type: "app.pocketfeed.feed.subscription",
    //       ...feeds[0],

    //       createdAt: new Date().toISOString(),
    //     },
    //     validate: false,
    //   });
    // }

    // console.log({ response });

    // updateTag("user-did:plc:fhhygitymqyet5inny6klful");

    console.log({ feeds });
    // console.log({ title: decodeURIComponent(feeds[0].title) });

    const insertedFeedItems = await db
      .insert(schema.feeds)
      .values(feeds)
      .onConflictDoNothing()
      .returning();

    // refresh();

    console.log({ insertedFeedItems });

    shouldRedirect = true;

    return {
      type: "success",
      message: "",
      payload: insertedFeedItems,
    };
  } catch (err) {
    return {
      type: "internal-error",
      // message: getErrorMessage(err) || INTERNAL_ERROR_MESSAGE,
      message: INTERNAL_ERROR_MESSAGE,
      payload: [],
    };
  }

  // if (shouldRedirect) {
  //   redirect(
  //     `/feed?feedUrl=${feeds[0].feedUrl}&title=${encodeURIComponent(feeds[0].title)}`,
  //   );
  // }
}
