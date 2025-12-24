"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import Button from "@/components/ui/custom-button";

import { followUser } from "@/app/actions/follow-user";
import { unFollowUser } from "@/app/actions/unfollow-user";
import { internalErrorToast } from "@/lib/utils";

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
      const { type, recordId, message } = await followUser(followeeName);
      if (type === "success") {
        toast.success(`Following ${followeeName}`);
        setRecordId(recordId as string);
        setFollow(true);
      } else if (type === "user-error") {
        toast.error(message);
      } else if (type === "internal-error") {
        internalErrorToast(message);
      }
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
      const { type, message } = await unFollowUser(recordId || followeeId);
      if (type === "success") {
        toast.success(`Unfollowed ${followeeName}`);
        setFollow(false);
      } else if (type === "user-error") {
        toast.error(message);
      } else if (type === "internal-error") {
        internalErrorToast(message);
      }
    });
  };
  if (user?.username === pathname.split("/")[2]) {
    return (
      <Link
        href="/settings"
        className="bg-ui-normal hover:bg-ui-hover h-9 content-center rounded-md px-4 text-sm font-medium duration-150"
        id="main-item"
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
