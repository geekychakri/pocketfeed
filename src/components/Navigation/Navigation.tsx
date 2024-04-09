"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Dropdown from "../FolderDropdown";

import ProfileAvatar from "../ProfileAvatar";

const routePaths = ["/", "/join", "/signin"];

export default function Navigation() {
  const pathname = usePathname();
  let isUserLoggedIn = pathname === "/" ? false : true;
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-4",
        pathname !== "/" && "border-b"
      )}
    >
      <div className="flex items-center gap-5">
        <div>
          <span>Pocket Feed</span>
        </div>
        {pathname.startsWith("/folder/") && (
          <>
            <div className="flex items-center gap-5">
              <hr className="border-0 bg-[#343434] w-[1px] h-4 rotate-[16deg]" />
              <Dropdown />
            </div>
            <Link href="/explore">Explore</Link>
          </>
        )}
      </div>

      {isUserLoggedIn ? (
        <div className="flex items-center gap-8">
          <Link href="/add">Add</Link>
          <ProfileAvatar />
        </div>
      ) : (
        <div className="flex gap-6">
          <Link
            href="signin"
            className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer bg-primary text-white"
          >
            Join
          </Link>
        </div>
      )}
    </nav>
  );
}
