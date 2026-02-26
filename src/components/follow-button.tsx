"use client";

import {
  startTransition,
  use,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";

import Button from "@/components/ui/custom-button";

import { followUser } from "@/app/actions/follow-user";
import { unFollowUser } from "@/app/actions/unfollow-user";
import { internalErrorToast } from "@/lib/utils";

export default function FollowButton({
  checkIsFollowingPromise,
  did,
  loggedInUserDid,
  // isFollowing,
  displayName,
}: {
  checkIsFollowingPromise: any;
  did: string;
  loggedInUserDid: string;
  // isFollowing: boolean;
  displayName: string;
}) {
  // const { user, isLoaded } = useUser();
  //

  const data = use(checkIsFollowingPromise);

  console.log({ data });

  const isFollowing = data?.length >= 1 ? true : false;

  const [follow, setFollow] = useState(isFollowing);
  const [recordId, setRecordId] = useState("");

  const [isOptimisticFollowingUser, setIsOptimisticFollowingUser] =
    useOptimistic(follow);

  // const pathname = usePathname();

  // const followeeName = pathname.split("/")[2];

  // if (!isLoaded) {
  //   return null;
  // }

  // console.log({ pathname });

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
      const { type, message } = await followUser(loggedInUserDid, did);
      if (type === "success") {
        toast.success(`Following ${displayName}`);
        // setRecordId(recordId as string);
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

  // if (loggedInUserDid === did) {
  //   return (
  //     <Link
  //       href="/settings"
  //       className="bg-ui-normal hover:bg-ui-hover h-9 content-center rounded-md px-4 text-sm font-medium duration-150"
  //       id="main-item"
  //     >
  //       Settings
  //     </Link>
  //   );
  // }
  return (
    <Button
      className="w-[200px]"
      onClick={follow ? handleUnFollow : handleFollow}
      {...(!isOptimisticFollowingUser && { variant: "cta" })}
      // disabled={!isLoaded}
    >
      {isOptimisticFollowingUser ? "Following" : "Follow"}
    </Button>
  );
}
