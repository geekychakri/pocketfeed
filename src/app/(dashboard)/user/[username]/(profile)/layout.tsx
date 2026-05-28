import { Suspense } from "react";

import { eq } from "drizzle-orm";
import { ErrorBoundary } from "react-error-boundary";

import RouteBack from "@/components/route-back";

import SegmentedControl from "@/app/(dashboard)/components/segmented-control";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

import UserProfile from "../components/user-profile";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ username: string }>;
}) {
  return (
    <main className="border-dashed-x mx-auto flex min-h-screen w-full max-w-180 flex-col gap-5">
      <Suspense fallback={null}>
        <ProfileHeader params={params} />
      </Suspense>
      <ErrorBoundary
        fallback={<div className="text-danger p-4">Something went wrong!</div>}
      >
        <Suspense fallback={<UserProfileFallback />}>
          <ProfileWrapper params={params}>{children}</ProfileWrapper>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

const ProfileWrapper = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username: handle } = await params;
  const checkIfUserExists = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.handle, handle));

  if (checkIfUserExists.length === 0) {
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

  return (
    <>
      <UserProfile params={params} />
      <SegmentedControlWrapper params={params} />
      {children}
    </>
  );
};
async function SegmentedControlWrapper({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const items = [
    { href: `/user/${username}`, title: "Posts" },
    {
      href: `/user/${username}/subscriptions`,
      title: "Subscriptions",
    },
  ];
  return <SegmentedControl items={items} />;
}

async function ProfileHeader({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="border-dashed-b relative flex h-14 items-center gap-3">
      <RouteBack className="absolute -left-9" />
      <p className="text-brand-primary px-4">{username}</p>
    </div>
  );
}

export function UserProfileFallback() {
  return (
    <div className="animate-pulse px-4 py-10">
      <div className="flex items-center justify-between">
        <div className="bg-skeleton-highlight size-23 rounded-full"></div>

        <div className="bg-skeleton-highlight h-9 w-25 rounded-md"></div>
      </div>
    </div>
  );
}
