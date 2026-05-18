import { Suspense } from "react";
import Link from "next/link";

import { and, count, eq } from "drizzle-orm";
import { ErrorBoundary } from "react-error-boundary";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import FollowButton from "@/components/follow-button";
import RouteBack from "@/components/route-back";
import SegmentedControl from "@/components/segmented-control";
import { CustomTooltip } from "@/components/ui/custom-tooltip";

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

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // const { userId }: { userId: string | null } = await auth();
  // const loggedInUserId = userId as string;
  // const loggedInUserInfo = await currentUser();

  // const user = (await xata.db.users
  //   .filter({ username: username })
  //   .getFirst()) as UsersRecord;

  // console.log({ user });
  const { username: handle } = await params;
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
    // {
    //   cache: "force-cache",
    // },
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

  // const followingRecord = await xata.db.follows
  //   .filter({ followerId: loggedInUserId, followeeId: user.userId as string })
  //   .getFirst(); //TODO:

  // console.log({ followingRecord });

  return (
    <div className="pt-10">
      <ProfileInfo>
        {/* <ProfileTitle username={user.username as string} /> */}
        <ProfileHeader
          profile={profile}
          loggedInUserDid={loggedInUserDid}
        ></ProfileHeader>
        <ProfileBody
          profile={profile}
          loggedInUsername={profile?.displayName as string}
        />

        <ProfileFooter
          username={profile?.handle as string}
          userDid={profile.did as string}
        />
      </ProfileInfo>

      {/* <SegmentedControl items={items} birthday={user.birthday as string} /> */}
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
    <Suspense
      fallback={
        <div className="animate-pulse">
          <div className="w-[100px] h-9 bg-skeleton-highlight rounded-md"></div>
        </div>
      }
    >
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
  // children,
  profile,
  loggedInUserDid,
}: {
  // children: React.ReactNode;
  profile: any;
  loggedInUserDid: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 items-center justify-between gap-4">
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

        {loggedInUserDid === profile.did ? (
          <Link
            href="/settings"
            className="bg-ui-normal hover:bg-ui-hover h-9 shrink-0 content-center rounded-md px-4 font-medium"
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
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-xl ">
          <span className="font-medium min-w-0 wrap-break-word">
            {profile.displayName}
          </span>
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
        <span className="text-text-secondary min-w-0 wrap-break-word">
          @{profile.handle}
        </span>
      </div>
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
    <div>
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
          className="custom-underline wrap-break-word text-text-secondary hover:text-text-primary duration-150"
        >
          Say hi with a short bio!
        </a>
      ) : null}
    </div>
  );
}

function ProfileFooter({
  username,
  userDid,
}: {
  username: string;
  userDid: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <ErrorBoundary
        fallback={<span className="text-danger">Something went wrong!</span>}
      >
        <Suspense
          fallback={
            <div className="flex animate-pulse space-x-4">
              <div className="bg-ui-normal h-5 w-20 rounded-md"></div>
            </div>
          }
        >
          <TotalFollowersCount username={username} userDid={userDid} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary
        fallback={<span className="text-danger">Something went wrong!</span>}
      >
        <Suspense
          fallback={
            <div className="flex animate-pulse space-x-4">
              <div className="bg-ui-normal h-5 w-20 rounded-md"></div>
            </div>
          }
        >
          <TotalFollowingCount username={username} userDid={userDid} />
        </Suspense>
      </ErrorBoundary>

      <Link href="/discover" className="text-sm custom-underline">
        Discover your Bluesky tribe
      </Link>
    </div>
  );
}

async function TotalFollowersCount({
  username,
  userDid,
}: {
  username: string;
  userDid: string;
}) {
  // const totalFollowersCount = await xata.db.follows.summarize({
  //   filter: { followeeName: username },
  //   columns: ["followeeName"],
  //   summaries: {
  //     total: { count: "*" },
  //   },
  // });

  const [{ followersCount }] = await db
    .select({ followersCount: count() })
    .from(schema.follows)
    .where(eq(schema.follows.followingDid, userDid));

  return (
    <Link
      href={`/user/${username}/followers`}
      className="hover:custom-underline text-text-secondary flex gap-1 text-sm"
    >
      <span className="text-brand-primary tabular-nums">
        {compactNumber(followersCount)}
      </span>
      <span>Followers</span>
    </Link>
  );
}

async function TotalFollowingCount({
  username,
  userDid,
}: {
  username: string;
  userDid: string;
}) {
  // const totalFollowingCount = await xata.db.follows.summarize({
  //   filter: { followerName: username },
  //   columns: ["followerName"],
  //   summaries: {
  //     total: { count: "*" },
  //   },
  // });

  const [{ followingCount }] = await db
    .select({ followingCount: count() })
    .from(schema.follows)
    .where(eq(schema.follows.followerDid, userDid));

  return (
    <Link
      href={`/user/${username}/follows`}
      className="hover:custom-underline text-text-secondary flex gap-1 text-sm transition-[background-image]"
    >
      <span className="text-brand-primary tabular-nums">
        {compactNumber(followingCount)}
      </span>
      <span>Following</span>
    </Link>
  );
}
