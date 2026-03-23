"use client";

import { use, useContext } from "react";
import Link from "next/link";

import { UserIcon } from "@/icons/user";

export default function DrawerProfileLink({
  getProfilePromise,
}: {
  getProfilePromise: any;
}) {
  const profile = use(getProfilePromise);
  console.log({ profile });
  return (
    <Link
      href={`/user/${profile.handle}`}
      className="w-full rounded-xl flex items-center gap-2 py-3 font-medium text-lg text-text-primary no-underline focus-visible:outline focus-visible:-outline-offset-1"
    >
      <UserIcon />
      Profile
    </Link>
  );
  // return "Profile";
}
