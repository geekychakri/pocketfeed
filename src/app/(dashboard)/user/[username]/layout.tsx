import UserProfile from "./components/user-profile";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Suspense } from "react";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  // const totalFollowersCount = await xata.db.follows.aggregate({
  //   totalFollowers: {
  //     count: {
  //       filter: {
  //         followeeName: params.username,
  //       },
  //     },
  //   },
  // });

  // const totalFollowersCount = await xata.db.follows.summarize({
  //   filter: { followeeName: params.username },
  //   columns: ["followeeName"],
  //   summaries: {
  //     total: { count: "*" },
  //   },
  // });

  // const totalFollowingCount = await xata.db.follows.aggregate({
  //   totalFollowings: {
  //     count: {
  //       filter: {
  //         followerName: params.username,
  //       },
  //     },
  //   },
  // });

  // const totalFollowingCount = await xata.db.follows.summarize({
  //   filter: { followerName: params.username },
  //   columns: ["followerName"],
  //   summaries: {
  //     total: { count: "*" },
  //   },
  // });

  // console.log({ totalFollowersCount });

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-5 py-20">
      <div className="relative flex items-center gap-3">
        <RouteBack className="absolute -left-9" />
        <p>{username}</p>
      </div>
      <Suspense fallback={<UserProfileFallback />}>
        <UserProfile username={username} />
        {children}
      </Suspense>
    </main>
  );
}

export function UserProfileFallback() {
  return (
    <div className="flex animate-pulse items-center justify-between">
      <div className="flex flex-col gap-4">
        <div className="bg-skeleton-highlight size-[92px] rounded-full"></div>
        <div className="bg-skeleton-highlight h-7 w-[250px] rounded"></div>
      </div>
      {/* <div className="h-9 w-[100px] rounded-md bg-gray-200"></div> */}
    </div>
  );
}
