import Link from "next/link";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import SegmentedControl from "@/components/SegmentedControl";

// import DOMPurify from "isomorphic-dompurify";

import { getXataClient, UsersRecord } from "@/xata";
import { auth, currentUser } from "@clerk/nextjs/server";
import { convertTextToLinks, getInitials } from "@/lib/utils";
import FollowButton from "@/components/FollowButton";

const xata = getXataClient();

export default async function UserLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: any;
  }>
) {
  const params = await props.params;

  const {
    children
  } = props;

  const { userId }: { userId: string | null } = await auth();
  const loggedInUserId = userId as string;
  // const loggedInUser = await currentUser();
  // console.log({ userId });
  console.log({ params: params.username });
  const user = (await xata.db.users
    .filter({ username: params.username })
    .getFirst()) as UsersRecord;

  console.log({ user });

  if (!user) {
    return <div>User not found!</div>;
  }

  const followee = await xata.db.follows
    .filter({ followerId: loggedInUserId, followeeId: user.userId as string })
    .getFirst(); //TODO:

  // const totalFollowersCount = await xata.db.follows.aggregate({
  //   totalFollowers: {
  //     count: {
  //       filter: {
  //         followeeName: params.username,
  //       },
  //     },
  //   },
  // });

  const totalFollowersCount = await xata.db.follows.summarize({
    filter: { followeeName: params.username },
    columns: ["followeeName"],
    summaries: {
      total: { count: "*" },
    },
  });

  // const totalFollowingCount = await xata.db.follows.aggregate({
  //   totalFollowings: {
  //     count: {
  //       filter: {
  //         followerName: params.username,
  //       },
  //     },
  //   },
  // });

  const totalFollowingCount = await xata.db.follows.summarize({
    filter: { followerName: params.username },
    columns: ["followerName"],
    summaries: {
      total: { count: "*" },
    },
  });

  console.log({ totalFollowersCount });

  console.log({ user });
  console.log({ followee });

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  const items = [
    { href: `/user/${user.username}`, title: "Posts" },
    { href: `/user/${user.username}/subscriptions`, title: "Subscriptions" },
  ];
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-5 py-20">
      {/* <h1>Hello {JSON.stringify(user)}</h1> */}
      <div className="flex flex-col gap-6">
        <div className="relative flex items-center gap-3">
          <RouteBack className="absolute -left-9" />
          <p>@{user.username}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Avatar className="inline-flex h-[92px] w-[92px] flex-none select-none items-center justify-center overflow-hidden rounded-full bg-background-secondary align-middle">
              <AvatarImage
                className="h-full w-full rounded-[inherit] object-cover"
                src={user.avatarUrl as string}
                alt={user?.fullname as string}
              />
              <AvatarFallback
                className="leading-1 flex h-full w-full items-center justify-center bg-background-secondary text-3xl font-medium"
                delayMs={600}
              >
                {getInitials((user.fullname || user.username) as string)}
              </AvatarFallback>
            </Avatar>

            <FollowButton isFollowing={followee?.id as string} />
          </div>

          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 font-medium">
              <span>{user.fullname || user.username}</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.054 2.344a3 3 0 0 1 3.892 0l1.271 1.084a1 1 0 0 0 .57.236l1.665.133a3 3 0 0 1 2.751 2.751l.133 1.666a1 1 0 0 0 .236.569l1.084 1.271a3 3 0 0 1 0 3.892l-1.084 1.271a1 1 0 0 0-.236.57l-.133 1.665a3 3 0 0 1-2.751 2.751l-1.666.133a1 1 0 0 0-.569.236l-1.271 1.084a3 3 0 0 1-3.892 0l-1.271-1.084a1 1 0 0 0-.57-.236l-1.665-.133a3 3 0 0 1-2.751-2.751l-.133-1.666a1 1 0 0 0-.236-.569l-1.084-1.271a3 3 0 0 1 0-3.892l1.084-1.271a1 1 0 0 0 .236-.57l.133-1.665a3 3 0 0 1 2.751-2.751l1.666-.133a1 1 0 0 0 .569-.236l1.271-1.084zm5.653 8.363a1 1 0 0 0-1.414-1.414L11 12.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                      fill="rgb(var(--brand-primary))"
                    />
                  </g>
                </svg>
              </span>
            </p>

            {user.bio && (
              <p
                className="prose whitespace-pre text-pretty text-text-secondary prose-a:text-brand-primary prose-a:no-underline"
                dangerouslySetInnerHTML={{
                  __html: convertTextToLinks(user.bio as string),
                }}
              ></p>
            )}
            {user.website && (
              <a
                href={`https://${user.website as string}`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start rounded-full bg-background-secondary px-2 py-1 text-xs"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-5">
          <Link href={`/user/${user.username}/followers`} className="text-sm">
            {totalFollowersCount?.summaries[0]?.total}{" "}
            <span className="text-text-secondary">Followers</span>
          </Link>
          <Link href={`/user/${user.username}/follows`} className="text-sm">
            {totalFollowingCount?.summaries[0]?.total}{" "}
            <span className="text-text-secondary">Following</span>
          </Link>
        </div>
      </div>
      <SegmentedControl items={items} birthday={user.birthday as string} />
      {children}
    </main>
  );
}
