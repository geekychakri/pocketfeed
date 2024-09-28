"use server";
import { redirect } from "next/navigation";
import qs from "qs";
import { nanoid } from "nanoid";

import { auth } from "@clerk/nextjs/server";

import { currentUser } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

type FeedsType = {
  feeds: {
    title: string;
    isChecked: string;
    rssURL: string;
  }[];
  folder: string;
  favicon: string;
};

export async function addFeeds(prevState: any, formData: FormData) {
  const user = await currentUser();
  console.log({ username: user?.username });
  const results = qs.parse(
    Object.fromEntries(formData.entries()) as {},
  ) as FeedsType;
  console.log(results);
  const feedId = nanoid();
  let feeds = [];

  if (results.feeds?.length > 1) {
    feeds = results?.feeds
      .filter((item) => Boolean(item.isChecked))
      .map((item) => {
        return {
          rssURL: item?.rssURL,
          title: item?.title,
          folder: results.folder,
          favicon: results.favicon,
          username: user?.username, //TODO:
          feedId,
        };
      });
  } else {
    feeds = results?.feeds.map((item) => {
      return {
        rssURL: item?.rssURL,
        folder: results.folder,
        favicon: results.favicon,
        title: item?.title,
        username: user?.username,
        feedId,
      };
    });
  }

  console.log(feeds);
  if (!(feeds.length >= 1)) {
    return {
      message: "Select at least one feed.",
    };
  }

  const records = await xata.db.feeds.create(feeds);

  redirect(`/folder/${results.folder}`);
  console.log("DONE");
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
  const website = formData.get("website") as string;
  const bio = formData.get("bio") as string;

  console.log({ fullname, website, bio });

  const { userId }: { userId: string | null } = auth();

  try {
    const user = await xata.db.users.filter({ clerkUserId: userId }).getFirst();
    // await user?.update({
    //   fullname,
    //   website,
    //   bio,
    // });
    const updateUser = await xata.db.users.update(user?.id as string, {
      fullname,
      website,
      bio,
    });

    return { message: "Profile updated successfully!" };
  } catch (err) {
    return { message: "Something went wrong!" };
  }
}
