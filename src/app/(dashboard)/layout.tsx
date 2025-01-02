import type { Metadata } from "next";

import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";

import Link from "next/link";

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
import NavigationItem from "@/components/NavigationItem";
import { ActivityIcon } from "@/icons/animated/ActivityIcon";
import { FavoriteIcon } from "@/icons/animated/Favorite";

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
      .filter({ userId: userId })
      .select(["avatarUrl", "username"])
      .getFirst(),
    getFolders(userId as string),
  ]);
  // const user = (await xata.db.users
  //   .filter({ userId: userId })
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
    <div className="flex">
      {/* <Navigation
        avatarUrl={user?.avatarUrl as string}
        username={user?.username as string}
        foldersList={foldersList}
      /> */}
      <nav className="fixed bottom-0 left-0 top-0 isolate z-30 flex h-screen w-[240px] flex-shrink-0 flex-col gap-4 self-start border-r-[0.5px] p-2">
        <h1>myPocketFeed.</h1>
        <div className="flex flex-1 flex-col gap-2">
          <NavigationItem to="/activity/discover" Icon={ActivityIcon}>
            <span className="font-medium">Activity</span>
          </NavigationItem>
          <NavigationItem to="/bookmarks" Icon={FavoriteIcon}>
            <span>Bookmarks</span>
          </NavigationItem>
          <Link href="/search">Search</Link>
          {/* <Link href="/add">Add feed</Link> */}

          <h2>Folders</h2>
        </div>

        <div>Profile</div>
      </nav>
      <div className="w-[240px]"></div>
      {/* {show && <PodcastPlayer />} */}
      <PodcastPlayer />
      {children}
    </div>
  );
}
