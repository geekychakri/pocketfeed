import { Suspense } from "react";

import { eq } from "drizzle-orm";

import RouteBack from "@/components/route-back";
import SegmentedControl from "@/components/segmented-control";

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
    <main className="mx-auto flex w-full max-w-[720px] min-h-screen flex-col gap-5 border-dashed-x">
      <Suspense fallback={null}>
        <ProfileHeader params={params} />
      </Suspense>
      <Suspense fallback={<UserProfileFallback />}>
        <ProfileWrapper params={params}>{children}</ProfileWrapper>
      </Suspense>
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
    <div className="relative flex items-center gap-3 h-14 border-dashed-b">
      <RouteBack className="absolute -left-9" />
      <p className="px-4 text-brand-primary">{username}</p>
    </div>
  );
}

export function UserProfileFallback() {
  return (
    <div className="animate-pulse py-10 px-4">
      <div className="flex items-center justify-between">
        <div className="bg-skeleton-highlight size-[92px] rounded-full"></div>

        <div className="w-[100px] h-9 bg-skeleton-highlight rounded-md"></div>
      </div>
    </div>
  );
}
