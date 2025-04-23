import type { Metadata } from "next";

import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";

import Link from "next/link";

import { GlobeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { BookmarkIcon } from "@/icons/bookmark";

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
import ProfileAvatar from "@/components/ProfileAvatar";
import CollapsibleFolders from "@/components/CollapsibleFolders";
import { ExploreIcon } from "@/icons/explore";
import SidebarNavigation from "@/components/sidebar-navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { show } = useShowPodcastPlayer();
  const { userId }: { userId: string | null } = auth();
  console.log({ userId });
  // HANDLE NULL FILTER //TODO:
  const [user, folders] = await Promise.all([
    xata.db.users
      .filter({ userId })
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

  // console.log(folders);
  // console.log({ user });

  const foldersList = folders.map((item) => ({
    id: item.id,
    folder: item.folder,
  })) as { id: string; folder: string }[];

  // console.log(foldersList);

  // const

  // console.log(user);

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  console.log({ username: user });
  return (
    <div className="flex">
      {/* <Navigation
        avatarUrl={user?.avatarUrl as string}
        username={user?.username as string}
        foldersList={foldersList}
      /> */}
      {/* <nav className="bg-background text-textColor fixed bottom-0 left-0 top-0 isolate z-30 flex h-screen w-[240px] flex-shrink-0 select-none flex-col self-start border-r border-border-primary">
        <div className="flex h-14 items-center px-4">
          <h1 className="font-medium">
            <span className="text-primary">my</span>Pocket<span>Feed.</span>
          </h1>
        </div>

        <div className="flex h-14 items-center justify-between gap-4 border-t border-border-primary px-4">
          <Link
            href="/add"
            className="flex-1 rounded-[4px] border border-border-primary bg-ui-normal px-4 py-1 text-center font-medium shadow-sm duration-75 hover:bg-ui-hover"
          >
            Add feed
          </Link>
          <Link href="/search/feeds" className="flex-none">
            <MagnifyingGlassIcon className="size-6 flex-none" />
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 border-t border-border-primary px-4 py-[10px]">
          <Link
            href="/activity/discover"
            className="flex h-10 items-center gap-3 rounded-md px-2 py-[10px] hover:bg-ui-hover active:bg-ui-hover"
          >
            <span>
              <ExploreIcon />
            </span>
            <span className="text-base">Activity</span>
          </Link>
          <Link
            href="/bookmarks"
            className="flex h-10 items-center gap-3 rounded-md px-2 py-[10px] hover:bg-ui-hover"
          >
            <span>
              <BookmarkIcon />
            </span>
            <span>Bookmarks</span>
          </Link>

          <CollapsibleFolders foldersList={foldersList} />
        </div>

        <div className="flex h-14 items-center gap-2 border-t border-border-primary px-4">
          <ProfileAvatar
            avatarUrl={user?.avatarUrl as string}
            username={user?.username as string}
          />
        </div>
      </nav> */}
      <SidebarNavigation
        foldersList={foldersList}
        user={JSON.parse(JSON.stringify(user))}
      />
      {/* <div className="w-[240px]"></div> */}
      {/* {show && <PodcastPlayer />} */}
      <PodcastPlayer />
      {children}
    </div>
  );
}
