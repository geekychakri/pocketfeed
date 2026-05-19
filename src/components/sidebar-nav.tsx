"use client";

import { Suspense } from "react";
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
  const { isOpen } = useToggleSidenav();

  console.log("RENDERED SIDEBAR");

  return (
    <>
      <nav
        id="sidebar"
        className={cn(
          `text-textColor bg-background-primary border-dashed-r fixed top-0 bottom-0 left-0 isolate z-30 grid h-screen w-[256px] grid-rows-[56px_56px_auto_minmax(0,1fr)_56px] transition-[translate] duration-150 select-none max-md:-translate-x-full`,
          isOpen && "max-md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-3">
          <h1 className="font-medium">
            <span className="text-primary">my</span>Pocket<span>Feed.</span>
          </h1>
        </div>

        <div className="border-dashed-y flex items-center justify-between gap-3 px-3">
          <Link
            href="/add"
            className="bg-ui-normal border-shadow hover:bg-ui-hover flex h-9 flex-1 items-center justify-center rounded-md font-medium transition-[background-color]"
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
