"use client";

import Link from "next/link";

import { play } from "cuelume";

import { useToggleSidenav } from "@/store/toggle-sidenav";

export default function MobileNav() {
  const { toggleIsOpen, isOpen } = useToggleSidenav();
  console.log({ isOpen });

  return (
    <nav className="bg-background-primary border-dashed-b sticky top-0 z-1000 hidden justify-between p-4 max-md:flex">
      <Link href="/activity/discover" prefetch={false}>
        Pocket Feed
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
