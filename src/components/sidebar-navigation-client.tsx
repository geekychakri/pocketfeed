"use client";

import {
  Activity,
  ComponentType,
  memo,
  Suspense,
  SVGProps,
  // use,
  // useEffect,
  // useRef,
  // useState,
} from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import Script from "next/script";

import { SelectedPick } from "@xata.io/client";

import CollapsibleFolders from "@/components/collapsible-folders";
import ProfileAvatar from "@/components/profile-avatar";

import { useMediaQuery } from "@/hooks/use-media-query";
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
  label: string;
  path: T;
  segment: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const links: NavItem<Route>[] = [
  { label: "Daily", path: "/daily", segment: "daily", icon: ExploreIcon },
  {
    label: "Activity",
    path: "/activity/discover",
    segment: "activity",
    icon: ActivityIcon,
  },
  {
    label: "Bookmarks",
    path: "/bookmarks",
    segment: "bookmarks",
    icon: BookmarkIcon,
  },
];

export default function SideNavClient() {
  const layoutSegment = useSelectedLayoutSegment();
  return (
    <div className="flex flex-col gap-1 pt-[10px] shadow-[0_-1px_0_0_var(--border-non-interactive)]">
      {links.map(({ label, path, segment, icon: Icon }, i) => {
        const isActive = layoutSegment === segment;

        console.log({ isActive });

        return (
          <div key={i} className="px-3">
            <Link
              href={path}
              className={cn(
                "hover:bg-ui-hover flex h-11 items-center gap-3 rounded-md px-3 py-[10px] transition-[background-color]",
                isActive && "bg-ui-hover font-medium",
              )}
            >
              <span>
                <Icon />
              </span>
              <span>{label}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
