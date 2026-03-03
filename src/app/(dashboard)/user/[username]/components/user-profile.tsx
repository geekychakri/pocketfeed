import { Suspense } from "react";
import Link from "next/link";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { ErrorBoundary } from "react-error-boundary";

import FollowButton from "@/components/follow-button";
import RouteBack from "@/components/route-back";
import SegmentedControl from "@/components/segmented-control";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user-avatar";

// import DOMPurify from "isomorphic-dompurify";

// import { getXataClient, UsersRecord } from "@/xata";
// const xata = getXataClient();

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { DotsLoaderIcon } from "@/icons/dots-loader";
import { GlobeErrorIcon } from "@/icons/globe-error";
import { UserErrorIcon } from "@/icons/user-error";
import { getDid, getSessionAgent } from "@/lib/auth/session";
import { compactNumber, convertTextToLinks, getInitials } from "@/lib/utils";

export default async function UserProfile({ handle }: { handle: string }) {
  // const { userId }: { userId: string | null } = await auth();
  // const loggedInUserId = userId as string;
  // const loggedInUserInfo = await currentUser();

  // const user = (await xata.db.users
  //   .filter({ username: username })
  //   .getFirst()) as UsersRecord;

  // console.log({ user });

  console.log({ handle });

  let isFollowing = false;
  // let checkIsFollowingPromise = Promise.resolve([]);

  const loggedInUserDid = (await getDid()) as string;

  const checkIfUserExists = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.handle, handle));

  const getProfile = fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`,
    {
      cache: "force-cache",
    },
  ).then((r) => r.json()); //TODO: actor pass dynamic did

  const [userExists, profile] = await Promise.all([
    checkIfUserExists,
    getProfile,
  ]);

  console.log({ userExists });
  console.log({ profile });

  if (userExists.length === 0) {
    // await getProfileResponse.body?.cancel(); //TODO:
    return (
      <div>
        <div className="h-14"></div>

        <div className="flex h-14 items-center px-4">
          <p>User not found!</p>
        </div>
      </div>
    );
  }

  // if (profile.did !== loggedInUserDid) {
  //   checkIsFollowingPromise = db
  //     .select()
  //     .from(schema.follows)
  //     .where(
  //       and(
  //         eq(schema.follows.followerDid, loggedInUserDid),
  //         eq(schema.follows.followingDid, profile.did),
  //       ),
  //     );
  //   // console.log({ checkIsFollowing });

  //   // if (checkIsFollowing.length > 0) {
  //   //   isFollowing = true;
  //   // }
  // }

  const items = [
    { href: `/user/${profile.displayName}`, title: "Posts" },
    {
      href: `/user/${profile.displayName}/subscriptions`,
      title: "Subscriptions",
    },
  ];

  // const followingRecord = await xata.db.follows
  //   .filter({ followerId: loggedInUserId, followeeId: user.userId as string })
  //   .getFirst(); //TODO:

  // console.log({ followingRecord });

  return (
    <div>
      <ProfileInfo>
        {/* <ProfileTitle username={user.username as string} /> */}
        <ProfileHeader profile={profile}>
          {loggedInUserDid === profile.did ? (
            <Link
              href="/settings"
              className="bg-ui-normal hover:bg-ui-hover h-9 content-center rounded-md px-4 text-sm font-medium duration-150"
              id="main-item"
            >
              Settings
            </Link>
          ) : (
            <FollowButtonWrapper
              loggedInUserDid={loggedInUserDid}
              profile={profile}
            />
          )}
        </ProfileHeader>
        <ProfileBody
          profile={profile}
          loggedInUsername={profile?.displayName as string}
        />
        <ProfileFooter username={profile?.displayName as string} />
      </ProfileInfo>

      {/* <SegmentedControl items={items} birthday={user.birthday as string} /> */}
      <SegmentedControl items={items} />
    </div>
  );
}

async function FollowButtonWrapper({
  loggedInUserDid,
  profile,
}: {
  loggedInUserDid: string;
  profile: any;
}) {
  const checkIsFollowingPromise = db
    .select()
    .from(schema.follows)
    .where(
      and(
        eq(schema.follows.followerDid, loggedInUserDid),
        eq(schema.follows.followingDid, profile.did),
      ),
    );

  return (
    <Suspense fallback="Loading...">
      <FollowButton
        checkIsFollowingPromise={checkIsFollowingPromise}
        did={profile.did}
        loggedInUserDid={loggedInUserDid}
        // isFollowing={isFollowing}
        displayName={profile.displayName}
      />
    </Suspense>
  );
}

async function ProfileInfo({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 px-4">{children}</div>;
}

// function ProfileTitle({ username }: { username: string }) {
//   return (
//     <div className="relative flex items-center gap-3">
//       <RouteBack className="absolute -left-9" />
//       <p>{username}</p>
//     </div>
//   );
// }

function ProfileHeader({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: any;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-4">
        <Avatar className="bg-background-secondary ring-ui-normal inline-flex h-[92px] w-[92px] flex-none items-center justify-center overflow-hidden rounded-full align-middle ring-1 select-none">
          <AvatarImage
            className="h-full w-full rounded-[inherit] object-cover"
            src={profile?.avatar as string}
            alt={profile?.fullname as string}
          />
          <AvatarFallback
            className="bg-background-secondary flex h-full w-full items-center justify-center text-3xl leading-1 font-medium"
            delayMs={600}
          >
            {getInitials(profile.displayName as string)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xl">
            <span className="font-medium">{profile.displayName}</span>
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
          <span className="text-text-secondary">@{profile.handle}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function ProfileBody({
  profile,
  loggedInUsername,
}: {
  profile: any;
  loggedInUsername: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {profile.description ? (
        <p
          className="prose text-text-secondary prose-a:text-brand-primary prose-a:no-underline whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: convertTextToLinks(profile?.description as string),
          }}
        ></p>
      ) : loggedInUsername === profile.displayName ? (
        <a
          href={`https://bsky.app/profile/${profile.handle}`}
          target="_blank"
          className="custom-underline text-text-secondary hover:text-text-primary self-start duration-150"
        >
          Say hi with a short bio!
        </a>
      ) : null}
      {/* {user.website && (
        <a
          href={`https://${user.website as string}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-background-secondary self-start rounded-full px-2 py-1 text-xs"
        >
          {user.website}
        </a>
      )} */}
    </div>
  );
}

function ProfileFooter({ username }: { username: string }) {
  return "Profile Footer";
  // return (
  //   <div className="flex items-center gap-5">
  //     <ErrorBoundary
  //       fallback={
  //         <CustomTooltip
  //           content={
  //             <div className="flex flex-col gap-1">
  //               <span className="text-danger">Something went wrong!</span>
  //               <span>Click to view your followers list.</span>
  //             </div>
  //           }
  //           side="bottom"
  //           sideOffset={10}
  //         >
  //           <Link
  //             href={`/user/${username}/followers`}
  //             className="hover:custom-underline text-danger flex items-center gap-1 text-sm"
  //           >
  //             <UserErrorIcon className="size-5" />
  //             <span>Followers</span>
  //           </Link>
  //         </CustomTooltip>
  //       }
  //     >
  //       <Suspense
  //         fallback={
  //           <div className="flex animate-pulse space-x-4">
  //             <div className="bg-ui-normal h-5 w-20 rounded-md"></div>
  //           </div>
  //         }
  //       >
  //         <TotalFollowersCount username={username as string} />
  //       </Suspense>
  //     </ErrorBoundary>

  //     <ErrorBoundary
  //       fallback={
  //         <CustomTooltip
  //           content={
  //             <div className="flex flex-col gap-1">
  //               <span className="text-danger">Something went wrong!</span>
  //               <span>Click to view your following list.</span>
  //             </div>
  //           }
  //           side="bottom"
  //           sideOffset={10}
  //         >
  //           <Link
  //             href={`/user/${username}/follows`}
  //             className="hover:custom-underline text-danger flex items-center gap-1 text-sm"
  //           >
  //             <UserErrorIcon className="size-5" />
  //             <span>Following</span>
  //           </Link>
  //         </CustomTooltip>
  //       }
  //     >
  //       <Suspense
  //         fallback={
  //           <div className="flex animate-pulse space-x-4">
  //             <div className="bg-ui-normal h-5 w-20 rounded-md"></div>
  //           </div>
  //         }
  //       >
  //         <TotalFollowingCount username={username as string} />
  //       </Suspense>
  //     </ErrorBoundary>
  //   </div>
  // );
}

async function TotalFollowersCount({ username }: { username: string }) {
  const totalFollowersCount = await xata.db.follows.summarize({
    filter: { followeeName: username },
    columns: ["followeeName"],
    summaries: {
      total: { count: "*" },
    },
  });

  return (
    <Link
      href={`/user/${username}/followers`}
      className="hover:custom-underline text-text-secondary flex gap-1 text-sm"
    >
      <span className="text-brand-primary tabular-nums">
        {compactNumber(totalFollowersCount?.summaries[0]?.total ?? 0)}
      </span>
      <span>Followers</span>
    </Link>
  );
}

async function TotalFollowingCount({ username }: { username: string }) {
  const totalFollowingCount = await xata.db.follows.summarize({
    filter: { followerName: username },
    columns: ["followerName"],
    summaries: {
      total: { count: "*" },
    },
  });

  return (
    <Link
      href={`/user/${username}/follows`}
      className="hover:custom-underline text-text-secondary flex gap-1 text-sm transition-[background-image]"
    >
      <span className="text-brand-primary tabular-nums">
        {compactNumber(totalFollowingCount?.summaries[0]?.total ?? 0)}
      </span>
      <span>Following</span>
    </Link>
  );
}
