"use client";

import {
  Activity,
  ComponentType,
  memo,
  Suspense,
  SVGProps,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import Script from "next/script";

import { SelectedPick } from "@xata.io/client";

import CollapsibleFolders from "@/components/collapsible-folders";
import ProfileAvatar from "@/components/profile-avatar";

import { ActivityIcon } from "@/icons/activity";
import { BookmarkIcon } from "@/icons/bookmark";
import { ExploreIcon } from "@/icons/explore";
import { SearchIcon } from "@/icons/search";
import { SidebarIcon } from "@/icons/sidebar";
import { cn } from "@/lib/utils";
import { useFullscreen } from "@/store/read-fullscreen";
import useStore from "@/store/useStore";
import { UsersRecord } from "@/xata";

import ProfileAvatarWrapper from "./profile-avatar-wrapper";

type NavItem<T extends string = string> = {
  path: T;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const links: NavItem<Route>[] = [
  { label: "Daily", path: "/daily", icon: ExploreIcon },
  { label: "Activity", path: "/activity/discover", icon: ActivityIcon },
  { label: "Bookmarks", path: "/bookmarks", icon: BookmarkIcon },
];

export default function SidebarNavigation({
  // user,

  children,
}: {
  // user: SelectedPick<UsersRecord, ("avatarUrl" | "username")[]> | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // console.log(pathname);
  // const segment = useSelectedLayoutSegment();

  // console.log({ segment });
  // const { fullscreen } = useFullscreen();
  // console.log({ fullscreen });

  // const fullscreen = useStore(useFullscreen, (state) => state.fullscreen);

  // console.log({ fullscreen });

  // const hasHydrated = useStore(useFullscreen, (state) => state.isRehydrated);

  // console.log({ fullscreen });
  // console.log({ hasHydrated });

  // if (!hasHydrated && pathname.startsWith("/read")) {
  //   return null;
  // }

  // if (fullscreen && pathname.startsWith("/read")) {
  //   return null;
  // }

  // useEffect(() => {
  //   window.requestAnimationFrame(() =>
  //     window.requestAnimationFrame(() => useFullscreen.persist.rehydrate()),
  //   );
  // }, []);

  // useEffect(() => {
  //   setCustomFullScreen(fullscreen)
  // },[])

  // if (
  //   fullscreen === null ||
  //   (fullscreen === undefined && pathname.startsWith("/read"))
  // ) {
  //   return null;
  // }

  // if (hasHydrated) {
  //   fullscreen === true ? (initialFullscreenRef.current = "false") : "";
  // }

  // if (initialFullscreenState === "true") {
  //   return null;
  // }

  // if (initialFullscreenRef.current === "true") {
  //   return null;
  // }

  // useEffect(() => {
  //   if (hasHydrated && !fullscreen) {
  //     initialFullscreenRef.current = "false";
  //   }
  // }, [fullscreen, hasHydrated]);

  console.log("RENDERED SIDEBAR WITH FOLDER LIST");

  // if (!hasHydrated) {
  //   return null;
  // }
  // if(fullscreenCookie === "true")

  // if (pathname.startsWith("/read")) {
  //   return null;
  // }

  return (
    <Activity mode={pathname.startsWith("/read") ? "hidden" : "visible"}>
      <header>
        <nav
          id="sidebar"
          className={`text-textColor bg-background-primary fixed top-0 bottom-0 left-0 isolate z-30 flex h-screen w-[240px] shrink-0 flex-col self-start shadow-[1px_0_0_0_var(--border-non-interactive)] transition-[translate] duration-150 select-none translate-x-0`}
        >
          <div className="flex h-14 items-center justify-between px-3">
            <h1 className="font-medium">
              <span className="text-primary">my</span>Pocket<span>Feed.</span>
            </h1>
          </div>

          <div className="flex h-14 items-center justify-between gap-3 px-3 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
            <Link
              href="/add"
              className="bg-ui-normal border-shadow hover:bg-ui-hover flex h-9 flex-1 items-center justify-center rounded-md font-medium transition-[background-color]"
            >
              Add feed
            </Link>
            <Link
              href="/search/feeds"
              className="hover:bg-ui-hover flex size-9 flex-none items-center justify-center rounded-md px-3 transition-[background-color]"
              aria-label="Search"
            >
              <SearchIcon className="flex-none" />
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-1 pt-[10px] shadow-[0_-1px_0_0_var(--border-non-interactive)]">
            {links.map(({ path, label, icon: Icon }, i) => {
              // const isActive = pathname === path;
              // const isActive =
              //   path === "/activity/discover"
              //     ? pathname.startsWith("/activity")
              //     : path === pathname;

              // console.log({isActive})

              return (
                <div key={i} className="px-3">
                  <Link
                    href={path}
                    className={cn(
                      "hover:bg-ui-hover flex h-11 items-center gap-3 rounded-md px-3 py-[10px] transition-[background-color]",
                      // isActive && "bg-ui-hover font-medium",
                    )}
                  >
                    <span>
                      <Icon />
                    </span>
                    <span className="font-medium">{label}</span>
                  </Link>
                </div>
              );
            })}

            <div className="flex flex-col justify-between flex-1">
              {children}
            </div>
          </div>

          {/* <div className="flex h-14 items-center gap-2 px-3 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
          <ProfileAvatar
            avatarUrl={user?.avatarUrl as string}
            username={user?.username as string}
          />
        </div> */}

          {/* <Suspense fallback="Loading...">
          <ProfileAvatarWrapper />
        </Suspense> */}
          {/* <Link href={`/test-server/${1}`} prefetch={false}>
          Test dynamic
        </Link> */}
        </nav>
        <div id="dummy-sidebar" className="w-[240px]"></div>
      </header>
    </Activity>
  );
}
