"use client";

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useToggleSidenav } from "@/store/toggle-sidenav";

import StaticNavContent from "../app/(dashboard)/components/static-nav-content";

export default function SidebarNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggleIsOpen } = useToggleSidenav();

  console.log("Sidenav");

  return (
    <>
      <nav
        id="sidebar"
        // ref={ref}
        className={cn(
          `text-textColor bg-background-primary border-dashed-r fixed top-0 bottom-0 left-0 isolate z-2000 grid h-screen w-[256px] grid-rows-[56px_56px_auto_minmax(0,1fr)_56px] transition-[translate] duration-150 select-none max-md:w-full max-md:-translate-x-full`,
          isOpen && "max-md:translate-x-0",
        )}
      >
        <div className="border-dashed-b flex items-center justify-between px-3">
          <h1 className="font-medium">
            <span className="text-primary">Pocket Feed</span>
          </h1>
          <button
            className="hidden items-center gap-1 max-md:flex"
            onClick={toggleIsOpen}
          >
            Close
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
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M18 6L6 18m12 0L6 6"
              />
            </svg>
          </button>
        </div>

        <div className="border-dashed-b flex items-center justify-between gap-3 px-3">
          <Link
            href="/add"
            className="bg-ui-normal border-shadow hover:bg-ui-hover flex h-9 flex-1 items-center justify-center rounded-md font-medium transition-[background-color]"
            onNavigate={() => toggleIsOpen()}
          >
            Add feed
          </Link>
        </div>

        <Suspense fallback={null}>
          <StaticNavContent />
        </Suspense>

        {children}
      </nav>
      <div
        id="dummy-sidebar hidden"
        className={cn("w-[256px] max-md:hidden")}
      ></div>
    </>
  );
}
