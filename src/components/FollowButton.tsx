"use client";

import { useState, useEffect, startTransition, useActionState } from "react";

import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";

import { useOptimistic } from "react";

import { usePathname, useRouter } from "next/navigation";

import { followUser, unFollowUser } from "@/app/actions";

import { toast } from "sonner";
import Link from "next/link";
import Button from "./ui/Button";

export default function FollowButton({ followeeId }: { followeeId: string }) {
  const { user, isLoaded } = useUser();

  const [follow, setFollow] = useState(followeeId ? true : false);
  const [recordId, setRecordId] = useState("");

  const [isOptimisticFollowingUser, setIsOptimisticFollowingUser] =
    useOptimistic(follow, (_, optimisticValue: boolean) => optimisticValue);

  const pathname = usePathname();

  const followeeName = pathname.split("/")[2];

  if (!isLoaded) {
    return null;
  }

  console.log({ pathname });

  const handleFollow = () => {
    // const res = await fetch("/api/follow/follow", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     followeeName: pathname.split("/")[2],
    //   }),
    // });
    // const data = await res.json();
    // setFollow(!follow);
    // console.log(data);
    // toast.success("Following username");

    startTransition(async () => {
      setIsOptimisticFollowingUser(true);
      const { message, recordId } = await followUser(followeeName);
      if (message === "success") {
        toast.success(`Following ${followeeName}`);
        setRecordId(recordId as string);
      } else {
        toast.error("Something went wrong!");
      }
      setFollow(true);
    });
  };

  const handleUnFollow = async () => {
    // const res = await fetch("/api/follow/unfollow", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     followeeName: pathname.split("/")[2],
    //   }),
    // });
    // const data = await res.json();
    // setFollow(!follow);
    // console.log(data);
    // toast.success("No longer Following  username");
    startTransition(async () => {
      setIsOptimisticFollowingUser(false);
      const { message } = await unFollowUser(recordId || followeeId);
      if (message === "success") {
        toast.success(`Unfollowed ${followeeName}`);
      } else {
        toast.error(`Something went wrong!`);
      }
      setFollow(false);
    });
  };
  if (user?.username === pathname.split("/")[2]) {
    return (
      <Link
        href="/settings"
        className="bg-ui-normal hover:bg-ui-hover h-9 content-center rounded-md px-4 text-sm font-medium duration-150"
      >
        Edit Profile
      </Link>
    );
  }
  return (
    <Button
      className="w-[200px]"
      onClick={follow ? handleUnFollow : handleFollow}
      {...(!isOptimisticFollowingUser && { variant: "cta" })}
      disabled={!isLoaded}
    >
      {isOptimisticFollowingUser ? "Following" : "Follow"}
    </Button>
  );
}
