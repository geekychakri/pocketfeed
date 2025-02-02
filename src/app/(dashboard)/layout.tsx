import type { Metadata } from "next";

import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";

import Link from "next/link";

import {
  GlobeIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

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
      <nav className="bg-background text-textColor border-border-primary fixed bottom-0 left-0 top-0 isolate z-30 flex h-screen w-[240px] flex-shrink-0 select-none flex-col self-start border-r">
        <div className="flex h-14 items-center px-4">
          <h1 className="font-medium">
            <span className="text-primary">my</span>Pocket<span>Feed.</span>
          </h1>
        </div>

        <div className="border-border-primary flex h-14 items-center justify-between gap-4 border-t px-4">
          <Link
            href="/add"
            className="border-border-primary flex-1 rounded-[4px] border bg-ui-normal px-4 py-1 text-center font-medium shadow-sm duration-75 hover:bg-ui-hover"
          >
            Add feed
          </Link>
          <Link href="/search/feeds" className="flex-none">
            <MagnifyingGlassIcon className="size-6 flex-none" />
          </Link>
        </div>
        <div className="border-border-primary flex flex-1 flex-col gap-4 border-t px-4 py-[10px]">
          <Link href="/activity/discover" className="flex items-center gap-3">
            {/* <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="#888888" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5"
                  />
                  <circle cx="19" cy="5" r="3" />
                  <path strokeLinecap="round" d="M7 14h9m-9 3.5h6" />
                </g>
              </svg>
            </span> */}
            <span className="text-base">Activity</span>
          </Link>
          <Link href="/bookmarks" className="flex items-center gap-3">
            {/* <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="#888888" strokeWidth="1.5">
                  <path d="M21 16.09v-4.992c0-4.29 0-6.433-1.318-7.766C18.364 2 16.242 2 12 2S5.636 2 4.318 3.332S3 6.81 3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321Z" />
                  <path strokeLinecap="round" d="M15 6H9" />
                </g>
              </svg>
            </span> */}
            <span>Bookmarks</span>
          </Link>
          {/* <Link href="/bookmarks" className="flex items-center gap-3">
            <span>Add Feed</span>
          </Link>

          <Link href="/bookmarks" className="flex items-center gap-3">
            <span>Search</span>
          </Link> */}

          <CollapsibleFolders foldersList={foldersList} />
        </div>

        <div className="border-border-primary flex h-14 items-center gap-2 border-t px-4">
          <ProfileAvatar
            avatarUrl={user?.avatarUrl as string}
            username={user?.username as string}
          />
          <span className="truncate text-sm font-medium text-text-secondary">
            {user?.username}
          </span>
        </div>
      </nav>
      <div className="w-[240px]"></div>
      {/* {show && <PodcastPlayer />} */}
      <PodcastPlayer />
      {children}
    </div>
  );
}
