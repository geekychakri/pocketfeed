"use server";
import { redirect, permanentRedirect } from "next/navigation";
import qs from "qs";
import { nanoid } from "nanoid";

import { auth, currentUser } from "@clerk/nextjs/server";

// import { currentUser } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";
import { revalidatePath } from "next/cache";

import Parser from "rss-parser";

import { cleanUrl, getErrorMessage } from "@/lib/utils";

import urlMetadata from "url-metadata";

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

async function checkIfFeedAlreadyExists(feeds: any, userId: string) {
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

  // console.log({ existingRssUrls });
  const uniqueRecords = feeds.filter(
    (record) => !existingRssUrls.has(record.rssURL),
  );
  console.log({ uniqueRecords });

  if (uniqueRecords.length >= 1) {
  } else {
    return { message: "Feed already exists!" };
  }
}

export async function addFeeds(prevState: any, formData: FormData) {
  const user = await currentUser();
  const userId = (await auth()).userId as string;
  console.log({ username: user?.username });
  const results = qs.parse(
    Object.fromEntries(formData.entries()) as {},
  ) as FeedsType;
  console.log({ results });

  const feedId = nanoid();
  let feeds = [];

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

  if (!(feeds.length >= 1)) {
    return {
      message: "Select at least one feed.",
    };
  }

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

  // console.log({ existingRssUrls });
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
      // console.log({ newFolder });
      // const p = await Promise.all([records, newFolder]);
      // console.log({ p });

      // const records = xata.db.feeds.create(feeds);
      // const folders = xata.db.folders.create({
      //   userId,
      //   folder,
      // });
      redirect(`/folder/${results.newFolder}`);
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

      redirect(`/folder/${results.folder}`);
    }
  } else {
    return { message: "Feed already exists!" };
  }

  // if (results.newFolder) {
  //   const folderExists = await xata.db.folders
  //     .filter({ userId, folder: { $iContains: results.newFolder } })
  //     .getFirst();

  //   if (folderExists) {
  //     return { message: "Folder with this name already exists." };
  //   }

  //   const newFolder = await xata.db.folders.create({
  //     userId,
  //     folder: results.newFolder,
  //     username: user?.username as string,
  //   });
  //   const newFeeds = feeds.map((feed) => ({
  //     ...feed,
  //     folderName: {
  //       id: newFolder.id,
  //       userId,
  //       folder: results.folder,
  //       username: user?.username as string,
  //     },
  //   }));
  //   const records = await xata.db.feeds.create(newFeeds as []);
  //   // console.log({ newFolder });
  //   // const p = await Promise.all([records, newFolder]);
  //   // console.log({ p });

  //   // const records = xata.db.feeds.create(feeds);
  //   // const folders = xata.db.folders.create({
  //   //   userId,
  //   //   folder,
  //   // });
  //   redirect(`/folder/${results.newFolder}`);
  //   console.log("DONE");
  // } else {
  //   const folder = await xata.db.folders
  //     .filter({ userId, folder: results.folder })
  //     .getFirst();

  //   const newFeeds = feeds.map((feed) => ({
  //     ...feed,
  //     folderName: {
  //       id: folder?.id,
  //       userId,
  //       folder: folder?.folder,
  //       username: user?.username as string,
  //     },
  //   }));

  //   const records = await xata.db.feeds.create(newFeeds as []);

  //   redirect(`/folder/${results.folder}`);
  // }
}

export async function createUser(email: string, username: string) {
  try {
    // Mutate data
    const record = await xata.db.users.create({
      email,
      username,
    });
    return { message: "success" };
  } catch (e) {
    throw new Error("Failed to create user");
  }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const fullname = formData.get("fullname") as string;
  const website = cleanUrl(formData.get("website") as string);
  const bio = formData.get("bio") as string;
  const birthday = formData.get("birthday") as string;

  console.log({ fullname, website, bio });

  const { userId }: { userId: string | null } = await auth();

  try {
    const user = await xata.db.users.filter({ userId: userId }).getFirst();
    // await user?.update({
    //   fullname,
    //   website,
    //   bio,
    // });
    const updateUser = await xata.db.users.update(user?.id as string, {
      fullname,
      website,
      bio,
      birthday,
    });
    revalidatePath("/user/[username]/(content)", "layout");
    return { type: "success", message: "Profile updated successfully!" };
  } catch (err) {
    return { type: "error", message: "Something went wrong!" };
  }
}

export async function addNewFolder(prevState: any, formData: FormData) {
  const user = await currentUser();
  const { userId }: { userId: string | null } = await auth();
  const folder = formData.get("folder") as string;
  const folderExists = await xata.db.folders
    .filter({ userId, folder })
    .getFirst();

  if (!folderExists) {
    const newFolder = await xata.db.folders.create({
      userId,
      folder,
      username: user?.username as string,
    });
    console.log({ newFolder });

    // if (!res.ok) {
    //   return { message: 'Please enter a valid email' }
    // }

    // redirect(`/folder/${folder}`);

    return { message: "success", id: newFolder.id };
  } else {
    return { message: "Folder already exists!", id: "" };
  }
}

export async function deleteFolder(prevState: any, formData: FormData) {
  const { userId }: { userId: string | null } = await auth();
  const folderId = formData.get("folderId") as string;
  console.log({ folderId });

  try {
    const deletedFolder = await xata.db.folders.delete(folderId); //Filter Delete TODO:
  } catch (err) {
    return { message: "Something went wrong!", statusCode: 500 };
  }

  // if (!res.ok) {
  //   return { message: 'Please enter a valid email' }
  // }

  // redirect(`/folder/${folder}`);

  permanentRedirect("/folder/Home");

  return { message: "success" };
}

export async function updateFolder(prevState: any, formData: FormData) {
  const { userId }: { userId: string | null } = await auth();
  const newFolderName = formData.get("new-folder-name") as string;
  const folderId = formData.get("folder-id") as string;

  console.log({ folderId });

  try {
    // throw new Error("OOOPS");
    const updateFolder = await xata.db.folders.update(folderId, {
      folder: newFolderName,
    });
  } catch (e) {
    return { message: "Something went wrong!", statusCode: 500 };
  }
  permanentRedirect(`/folder/${newFolderName}`);
}

export async function deleteFeed(prevState: any, formData: FormData) {
  console.log("DELETE FEED");
  try {
    throw new Error("");
    const { userId }: { userId: string | null } = await auth();
    const feedId = formData.get("feedId") as string;
    const folderName = formData.get("folderName") as string;

    console.log({ folderName });

    console.log({ feedId });
    const deletedFeed = await xata.db.feeds.delete(feedId);

    console.log("DELETED");
    // revalidatePath(`/folder/${folderName}`, "page");
    return { message: "success" };
  } catch (err) {
    return { message: "error" };
  }
}

export async function moveToFolder(
  id: string,
  currentFolder: string,
  newFolder: string,
) {
  const userId = (await auth()).userId;
  const folder = await xata.db.folders
    .filter({ userId, folder: newFolder })
    .getFirst();

  const folders = await xata.db.feeds.update(id, {
    folderName: folder?.id,
  });
  // // revalidatePath(`/folder/${currentFolder}`, "page");
  return { message: "success" };
}

export async function addPost(prevState: any, formData: FormData) {
  const user = await currentUser();
  const post = formData.get("post") as string;
  const feedItemUrl = (formData.get("feedItemUrl") as string) || "";

  // const itemType = formData.get("type");

  const feedItem = formData.get("feedItem") as string;
  const feedAlbumCover = formData.get("feedAlbumCover") as string;
  const feedTitle = formData.get("feedTitle") as string;
  const websiteLink = formData.get("websiteLink") as string;

  // console.log({ feedItem });

  console.log({ feedAlbumCover });

  // const metadata = await urlMetadata(feedItemUrl);  //Check  url  is present

  // const { title = "", author = "", description = "" } = metadata;

  // console.log({ metadata });

  await xata.db.posts.create({
    body: post,
    // feedItemUrl,
    // feedItemTitle: title,
    // feedItemDescription: description,
    // feedItemAuthor: author,
    feedItem,
    feedTitle,
    feedAlbumCover,
    websiteLink,
    username: user?.username as string,
  });

  return { message: "success" };
}

export async function deleteSubscriptions(prevState: any, formData: FormData) {
  const { feedIdList } = qs.parse(
    Object.fromEntries(formData.entries()) as {},
  ) as {
    feedIdList: {};
  };
  if (!feedIdList) {
    return { message: "Select at least one feed." };
  }
  const idList = Object.values(feedIdList) as string[];
  const data = await xata.db.feeds.delete(idList);
  revalidatePath("/user/[username]/subscriptions", "page");

  return { message: "success" };
}

export async function addBookmarkAction(formData: FormData) {
  try {
    const userId = (await auth()).userId as string;
    if (!userId) {
      throw new Error("You must be signed in to add a bookmark");
    }
    const bookmarkLink = formData.get("bookmarkLink") as string;
    const bookmarkType = formData.get("bookmarkType") as string;
    const bookmarkTitle = formData.get("bookmarkTitle") as string;

    const data = await xata.db.bookmarks.create({
      userId,
      bookmarkLink,
      bookmarkType,
      bookmarkTitle,
    });

    return { message: "success", bookmarkId: data.id };
  } catch (err) {
    //send error to 3rd party services like sentry //TODO:
    return { message: getErrorMessage(err), bookmarkId: "" };
  }
}

// export async function deleteBookmarkAction(formData: FormData) {
//   const bookmarkId = formData.get("bookmarkId") as string;

//   console.log({ bookmarkId });

//   const data = await xata.db.bookmarks.delete(bookmarkId);

//   return { message: "success" };
// }

export async function deleteBookmarkAction(prevState: any, formData: FormData) {
  // console.log("DELETE FEED");
  try {
    const { userId }: { userId: string | null } = await auth();
    const bookmarkId = formData.get("bookmarkId") as string;

    console.log({ bookmarkId });

    const deletedFeed = await xata.db.bookmarks.delete(bookmarkId);

    console.log("DELETED");
    // revalidatePath(`/folder/${folderName}`, "page");
    return { message: "success" };
  } catch (err) {
    return { message: "error" };
  }
}

export async function followUser(followeeName: string) {
  try {
    const followerId = (await auth()).userId as string;
    const user = await currentUser();
    const followerName = user?.username as string;

    const followeeUser = await xata.db.users
      .filter({ username: followeeName })
      .getFirst();

    const result = await xata.db.follows.create({
      followerId,
      followeeId: followeeUser?.userId as string,
      followerName,
      followeeName,
    });

    console.log({ result });
    revalidatePath("/user/[username]/(content)", "layout");
    return { message: "success", recordId: result.id };
  } catch (err) {
    console.log(err);
    return { message: "" };
  }
}

export async function unFollowUser(recordId: string) {
  console.log({ recordId });
  try {
    // const followerId = (await auth()).userId as string;

    // const followeeUser = await xata.db.users
    //   .filter({ username: followeeName })
    //   .getFirst();

    // const record = await xata.db.follows
    //   .filter({ followerId, followeeId: followeeUser?.userId as string })
    //   .getFirst();

    const result = await xata.db.follows.delete(recordId as string);

    revalidatePath("/user/[username]/(content)", "layout");

    return { message: "success" };
  } catch (err) {
    console.log(err);
    return { message: "" };
  }
}

export async function testAction() {
  console.log("TEST FEED");
  try {
    return { message: "success" };
  } catch (err) {
    return { message: "error" };
  }
}
