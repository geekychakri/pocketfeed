"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";

import { play } from "cuelume";

import { useToggleSidenav } from "@/store/toggle-sidenav";

export default function MobileNav() {
  const [activityPath, setActivityPath] = useState<Route>("/activity/discover");
  const { toggleIsOpen, isOpen } = useToggleSidenav();
  console.log({ isOpen });

  useEffect(() => {
    const path =
      (localStorage.getItem("activity-preferred") as Route | null) ??
      "/activity/discover";

    setActivityPath(path);
  }, []);

  return (
    <nav className="bg-background-primary border-dashed-b sticky top-0 z-1000 hidden justify-between p-4 max-md:flex">
      <Link href={activityPath} className="flex items-center gap-1">
        <img src="/apple-touch-icon.png" className="size-8" />
        <span className="text-text-primary font-medium">Pocket Feed</span>
      </Link>
      <button
        className="flex items-center gap-1"
        onClick={() => {
          toggleIsOpen();
          play("tick");
        }}
      >
        Menu
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M20 7H4m16 5H4m16 5H4"
          />
        </svg>
      </button>
    </nav>
  );
}
