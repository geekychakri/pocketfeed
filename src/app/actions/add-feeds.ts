"use server";

import { redirect } from "next/navigation";

import { auth, currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import qs from "qs";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { addFeedSchema } from "@/lib/zod/schemas/add-feed";
import { getXataClient } from "@/xata";

const xata = getXataClient();

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssURL: string;
  }[];
  folder: string;
  newFolder: string;
  favicon: string;
  siteURL: string;
};

export async function addFeeds(prevState: any, formData: FormData) {
  let results: FeedsType;
  let shouldRedirect: boolean;
  try {
    const userId = (await auth()).userId as string;

    if (!userId) {
      throw new Error("You must be signed in to add a feed!");
    }
    const user = await currentUser();
    console.log({ username: user?.username });
    results = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as FeedsType;
    // console.log({ results });

    const validateFields = addFeedSchema.safeParse(results);
    // console.log({ validateFields });
    // console.log({ feeds: validateFields.data?.feeds });

    // console.log({ error: validateFields.error?.flatten().fieldErrors });

    if (!validateFields.success) {
      console.log(validateFields.error.flatten().fieldErrors);
      return {
        type: "error",
        message: "Please fix the errors in the form.",
        errors: validateFields.error.flatten().fieldErrors,
      };
    }

    console.log({ results });

    if (results.feeds.length > 1) {
      const checkIfFeedIsPresent = results.feeds.some(
        (item) => item.isChecked === "on",
      );

      if (!checkIfFeedIsPresent) {
        return {
          type: "error",
          message: "Select at least one feed.",
        };
      }
    }

    let feeds = [];

    console.log({ feeds: results.feeds });

    if (results.feeds?.length > 1) {
      feeds = results?.feeds
        .filter((item) => Boolean(item.isChecked))
        .map((item) => {
          return {
            rssURL: item?.rssURL,
            title: item?.title,
            // folder: results.folder,
            favicon: results.favicon,
            siteURL: results.siteURL,
            username: user?.username, //TODO:
            feedId: nanoid(),
            userId,
          };
        });
    } else {
      feeds = results?.feeds.map((item) => {
        return {
          rssURL: item?.rssURL,
          // folder: results.folder,
          favicon: results.favicon,
          siteURL: results.siteURL,
          title: item?.title,
          username: user?.username,
          feedId: nanoid(),
          userId,
        };
      });
    }

    // console.log({ feeds });

    //CHECK IF FEED EXISTS //TODO: SPLIT IT
    const rssUrls = feeds.map((feed) => feed.rssURL);

    // console.log(rssUrls);

    const existingRecords = await xata.db.feeds
      .filter({
        userId,
        rssURL: { $any: rssUrls },
      })
      .getAll();

    // console.log({ existingRecords });

    const existingRssUrls = new Set(
      existingRecords.map((record) => record.rssURL),
    );

    // If user adds multiple feeds filter out the existing feeds from the list and check whether the filtered list item is already present
    const uniqueRecords = feeds.filter(
      (record) => !existingRssUrls.has(record.rssURL),
    );
    console.log({ uniqueRecords });

    if (uniqueRecords.length >= 1) {
      if (results.newFolder) {
        const folderExists = await xata.db.folders
          .filter({ userId, folder: { $iContains: results.newFolder } })
          .getFirst();

        if (folderExists) {
          return { message: "Folder with this name already exists." };
        }

        const newFolder = await xata.db.folders.create({
          userId,
          folder: results.newFolder,
          username: user?.username as string,
        });
        const newFeeds = uniqueRecords.map((feed) => ({
          ...feed,
          folderName: {
            id: newFolder.id,
            userId,
            folder: results.folder,
            username: user?.username as string,
          },
        }));
        const records = await xata.db.feeds.create(newFeeds as []);
        shouldRedirect = true;
        // redirect(`/folder/${results.newFolder}`); //TODO:
        console.log("DONE");
      } else {
        const folder = await xata.db.folders
          .filter({ userId, folder: results.folder })
          .getFirst();

        const newFeeds = uniqueRecords.map((feed) => ({
          ...feed,
          folderName: {
            id: folder?.id,
            userId,
            folder: folder?.folder,
            username: user?.username as string,
          },
        }));

        console.log({ newFeeds });

        const records = await xata.db.feeds.create(newFeeds as []);

        shouldRedirect = true;
        // redirect(`/folder/${results.folder}`); //TODO:
      }
    } else {
      return { type: "error", message: "Feed already exists!" };
    }
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }

  if (shouldRedirect) {
    redirect(`/folder/${results.folder || results.newFolder}`);
  }
}
