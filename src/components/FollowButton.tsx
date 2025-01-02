"use client";

import { useState, useEffect } from "react";

import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";

import { usePathname, useRouter } from "next/navigation";

import { toast } from "sonner";

export default function FollowButton({ isFollowing }: { isFollowing: string }) {
  const { isSignedIn, user, isLoaded } = useUser();

  const [follow, setFollow] = useState(isFollowing ? true : false);

  const { userId } = useAuth();

  const pathname = usePathname();

  if (!isLoaded) {
    return null;
  }

  console.log({ pathname });

  const handleFollow = async () => {
    const res = await fetch("/api/follow/follow", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        followeeName: pathname.split("/")[2],
      }),
    });
    const data = await res.json();
    setFollow(!follow);
    console.log(data);
    toast.success("Following username");
  };

  const handleUnFollow = async () => {
    const res = await fetch("/api/follow/unfollow", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        followeeName: pathname.split("/")[2],
      }),
    });
    const data = await res.json();
    setFollow(!follow);
    console.log(data);
    toast.success("No longer Following  username");
  };
  if (user?.username === pathname.split("/")[2]) {
    return null;
  }
  return (
    <button
      className="w-[200px] self-end rounded-md border bg-primary px-2 py-2 font-medium text-white"
      onClick={follow ? handleUnFollow : handleFollow}
    >
      {follow ? "following" : "Follow"}
    </button>
  );
}
