"use client";

import { startTransition, use, useOptimistic, useState } from "react";

import { toast } from "sonner";

import Button from "@/components/ui/custom-button";

import { followUser } from "@/app/actions/follow-user";
import { unFollowUser } from "@/app/actions/unfollow-user";
import { internalErrorToast } from "@/lib/utils";

export default function FollowButton({
  checkIsFollowingPromise,
  did,
  loggedInUserDid,

  displayName,
}: {
  checkIsFollowingPromise: any;
  did: string;
  loggedInUserDid: string;

  displayName: string;
}) {
  const data: [] = use(checkIsFollowingPromise);

  console.log({ data });

  const isFollowing = data?.length >= 1 ? true : false;

  const [follow, setFollow] = useState(isFollowing);

  const [isOptimisticFollowingUser, setIsOptimisticFollowingUser] =
    useOptimistic(follow);

  const handleFollow = () => {
    startTransition(async () => {
      setIsOptimisticFollowingUser(true);
      const { type, message } = await followUser(loggedInUserDid, did);
      if (type === "success") {
        toast.success(`Following ${displayName}`);

        setFollow(true);
      } else if (type === "user-error") {
        toast.error(message);
      } else if (type === "internal-error") {
        internalErrorToast(message);
      }
    });
  };

  const handleUnFollow = async () => {
    startTransition(async () => {
      setIsOptimisticFollowingUser(false);
      const { type, message } = await unFollowUser(loggedInUserDid, did);
      if (type === "success") {
        toast.success(`No longer following ${displayName}`);
        setFollow(false);
      } else if (type === "user-error") {
        toast.error(message);
      } else if (type === "internal-error") {
        internalErrorToast(message);
      }
    });
  };

  return (
    <Button
      className="w-50 shrink-0"
      onClick={follow ? handleUnFollow : handleFollow}
      {...(!isOptimisticFollowingUser && { variant: "cta" })}
      // disabled={!isLoaded}
    >
      {isOptimisticFollowingUser ? "Following" : "Follow"}
    </Button>
  );
}
