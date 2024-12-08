"use client";

import { useState, useEffect } from "react";

import { useUser } from "@clerk/clerk-react";
import { usePathname, useRouter } from "next/navigation";

export default function FollowButton() {
  const { isSignedIn, user, isLoaded } = useUser();

  const pathname = usePathname();

  if (!isLoaded) {
    return null;
  }

  console.log({ pathname });
  if (user?.username === pathname.split("/")[2]) {
    return null;
  }
  return (
    <button className="w-[200px] self-end rounded-md border bg-primary px-2 py-2 font-medium text-white">
      Follow
    </button>
  );
}
