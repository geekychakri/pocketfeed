"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import Combobox from "../Combobox";

import Dropdown from "../Dropdown";

export default function Navigation() {
  const pathname = usePathname();
  let isUserLoggedIn = pathname === "/" ? false : true;
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-5">
        <div>
          <span>Pocket Feed</span>
        </div>
        {isUserLoggedIn && (
          <>
            <div className="flex items-center gap-5">
              <hr className="border-0 bg-[#343434] w-[1px] h-4 rotate-[16deg]" />
              <Dropdown />
            </div>

            <div>Explore</div>
          </>
        )}
      </div>

      {isUserLoggedIn ? (
        <div>Profile</div>
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
