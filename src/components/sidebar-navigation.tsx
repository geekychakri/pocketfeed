"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchIcon } from "@/icons/search";
import { ExploreIcon } from "@/icons/explore";
import { BookmarkIcon } from "@/icons/bookmark";

import CollapsibleFolders from "@/components/CollapsibleFolders";
import ProfileAvatar from "@/components/ProfileAvatar";

import { cn } from "@/lib/utils";

import { useSelectedLayoutSegment } from "next/navigation";

import { UsersRecord } from "@/xata";
import { SelectedPick } from "@xata.io/client";
import RouteBack from "./RouteBack/RouteBack";

const links = [
  { label: "Activity", path: "/activity/discover", icon: ExploreIcon },
  { label: "Bookmarks", path: "/bookmarks", icon: BookmarkIcon },
];

export default function SidebarNavigation({
  foldersList,
  user,
}: {
  foldersList: { id: string; folder: string }[];
  user: SelectedPick<UsersRecord, ("avatarUrl" | "username")[]> | null;
}) {
  const pathname = usePathname();
  // console.log(pathname);
  const segment = useSelectedLayoutSegment();
  // console.log({ segment });
  return (
    <nav className="bg-background text-textColor fixed bottom-0 left-0 top-0 isolate z-30 flex h-screen w-[240px] flex-shrink-0 select-none flex-col self-start shadow-[1px_0_0_0_var(--border-non-interactive)]">
      <div className="flex h-14 items-center justify-between px-3">
        <h1 className="font-medium">
          <span className="text-primary">my</span>Pocket<span>Feed.</span>
        </h1>
      </div>

      <div className="flex h-14 items-center justify-between gap-3 px-3 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
        <Link
          href="/add"
          className="flex h-9 flex-1 items-center justify-center rounded-md bg-ui-normal"
        >
          Add feed
        </Link>
        <Link
          href="/search/feeds"
          className="flex h-9 items-center rounded-md px-3 transition-colors hover:bg-ui-normal"
          aria-label="Search"
        >
          <SearchIcon className="flex-none" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 py-[10px] shadow-[0_-1px_0_0_var(--border-non-interactive)]">
        {/* <Link
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
        </Link> */}

        {links.map(({ path, label, icon: Icon }, i) => {
          const isActive = pathname === path;
          return (
            <Link
              href={path}
              key={i}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 py-[10px] transition-[background-color] hover:bg-ui-hover",
                isActive && "bg-ui-hover",
              )}
            >
              <span>
                <Icon />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}

        <CollapsibleFolders foldersList={foldersList} />
      </div>

      <div className="flex h-14 items-center gap-2 px-3 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
        <ProfileAvatar
          avatarUrl={user?.avatarUrl as string}
          username={user?.username as string}
        />
      </div>
    </nav>
  );
}
