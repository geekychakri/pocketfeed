"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@/lib/utils";
import { useToggleSidenav } from "@/store/toggle-sidenav";

import HoverPrefetchLink from "./hover-prefetch-link";

type NavItem<T extends string = string> = {
  label: string;
  path: T;
  segment: string;
};

const links: NavItem<Route>[] = [
  {
    label: "Activity",
    path: "/activity/discover",
    segment: "activity",
  },
  { label: "Daily", path: "/daily", segment: "daily" },
];

export default function SideNavClient() {
  const [activityPath, setActivityPath] = useState<Route>("/activity/discover");

  useEffect(() => {
    const path =
      (localStorage.getItem("activity-preferred") as Route | null) ??
      "/activity/discover";

    setActivityPath(path);
  }, []);
  const layoutSegment = useSelectedLayoutSegment();
  const { toggleIsOpen } = useToggleSidenav();

  const links: NavItem<Route>[] = [
    {
      label: "Activity",
      path: activityPath,
      segment: "activity",
    },
    { label: "Daily", path: "/daily", segment: "daily" },
  ];

  return (
    <div className="border-dashed-b flex flex-col gap-1 py-2.5">
      {links.map(({ label, path, segment }, i) => {
        const isActive = layoutSegment === segment;

        console.log({ isActive });

        return (
          <div key={i} className="px-3">
            <HoverPrefetchLink
              href={path}
              className={cn(
                "hover:bg-ui-hover flex h-11 items-center gap-3 rounded-md px-3 py-2.5 transition-[background-color] duration-100",
                isActive && "bg-ui-hover font-medium",
              )}
              onNavigate={toggleIsOpen}
            >
              <span>{label}</span>
            </HoverPrefetchLink>
          </div>
        );
      })}
    </div>
  );
}
