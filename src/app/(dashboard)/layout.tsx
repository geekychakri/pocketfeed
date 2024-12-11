import type { Metadata } from "next";

import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";

const PodcastPlayer = dynamic(() => import("@/components/PodcastPlayer"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Pocket Feed",
  description: "All of your favorite content in one place.",
};

import { FoldersRecord, getXataClient, UsersRecord } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

const xata = getXataClient();

// const fetchFolders = cache(async (userId: string) => {
//   return await xata.db.folders.filter({ userId }).select(["folder"]).getMany();
// });

import getFolders from "@/lib/getFolders";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { show } = useShowPodcastPlayer();
  const { userId }: { userId: string | null } = auth();
  console.log({ userId });
  const [user, folders] = await Promise.all([
    xata.db.users
      .filter({ clerkUserId: userId })
      .select(["avatarUrl", "username"])
      .getFirst(),
    getFolders(userId as string),
  ]);
  // const user = (await xata.db.users
  //   .filter({ clerkUserId: userId })
  //   .select(["avatarUrl", "username"])
  //   .getFirst()) as UsersRecord;

  // const folders = await xata.db.folders
  //   .filter({ userId })
  //   .select(["folder"])
  //   .getMany();

  console.log(folders);

  const foldersList = folders.map((item) => ({
    id: item.id,
    folder: item.folder,
  })) as { id: string; folder: string }[];

  console.log(foldersList);

  // const

  console.log(user);

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  console.log({ username: user?.username });
  return (
    <>
      <Navigation
        avatarUrl={user?.avatarUrl as string}
        username={user?.username as string}
        foldersList={foldersList}
      />
      {/* {show && <PodcastPlayer />} */}
      <PodcastPlayer />
      {children}
    </>
  );
}
