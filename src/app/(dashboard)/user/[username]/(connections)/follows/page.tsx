import { Suspense } from "react";
import Link from "next/link";

import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ErrorBoundary } from "react-error-boundary";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import RouteBack from "@/components/route-back";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
// import { getDid } from "@/lib/auth/session";
import { getInitials } from "@/lib/utils";

export default async function Following({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <FollowsHeader params={params} />
      </Suspense>
      <ErrorBoundary
        fallback={<div className="text-danger p-4">Something went wrong!</div>}
      >
        <Suspense fallback={<FollowsListFallback />}>
          <FollowsList params={params} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

const FollowsList = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username: handle } = await params;

  const targetUser = alias(schema.users, "target_user");

  const follows = await db
    .select({
      did: schema.users.did,
      handle: schema.users.handle,
      displayName: schema.users.displayName,
      avatar: schema.users.avatar,
      createdAt: schema.follows.createdAt,
    })
    .from(schema.follows)
    .innerJoin(targetUser, eq(schema.follows.followerDid, targetUser.did))
    .innerJoin(schema.users, eq(schema.follows.followingDid, schema.users.did))
    .where(eq(targetUser.handle, handle));
  console.log({ follows: follows });

  if (follows.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            >
              <path
                strokeDasharray="20"
                strokeDashoffset="20"
                d="M3 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.2s"
                  values="20;0"
                />
              </path>
              <path
                strokeDasharray="20"
                strokeDashoffset="20"
                d="M9 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.2s"
                  dur="0.2s"
                  values="20;0"
                />
              </path>
              <path strokeDasharray="10" strokeDashoffset="10" d="M15 3l6 6">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.5s"
                  dur="0.2s"
                  values="10;0"
                />
              </path>
              <path strokeDasharray="10" strokeDashoffset="10" d="M21 3l-6 6">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.7s"
                  dur="0.2s"
                  values="10;0"
                />
              </path>
            </g>
          </svg>

          <p className="text-text-secondary">Not following anyone yet!</p>
          <RouteBack text="Go back" />
        </div>
      </>
    );
  }
  return (
    <>
      {/* <div>
        <p>{username}</p>
        <p className="text-text-secondary">{followers.length} followers</p>
      </div> */}
      {follows.map((profile, i) => {
        return (
          <Link
            href={`/user/${profile.handle}`}
            key={profile.did}
            className="border-dashed-b p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-10 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none group-hover:ring-2">
                <AvatarImage
                  className="h-full w-full rounded-[inherit] object-cover"
                  src={profile.avatar as string}
                  alt={profile.displayName || profile.handle}
                />
                <AvatarFallback
                  // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
                  delayMs={600}
                >
                  {getInitials(profile.displayName || profile.handle)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile.displayName}</p>
                <p className="text-text-secondary text-sm">{profile.handle}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

async function FollowsHeader({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="border-dashed-b sticky top-0 flex h-14 items-center">
      <RouteBack className="absolute -left-9" />
      <p className="text-brand-primary px-4">{username}</p>
    </div>
  );
}

function FollowsListFallback() {
  return (
    <div className="min-h-screen animate-pulse">
      {Array.from({ length: 20 }, (_, i) => {
        return (
          <div key={i} className="border-dashed-b h-18.75 w-full p-4">
            <div className="flex items-center gap-3">
              <div className="bg-skeleton-highlight size-10 rounded-full"></div>

              <div className="flex flex-col gap-1">
                <p className="bg-skeleton-highlight h-4 w-37.5"></p>
                <p className="bg-skeleton-highlight h-4 w-37.5"></p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
