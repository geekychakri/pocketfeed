import type { Metadata } from "next";

import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";

const PodcastPlayer = dynamic(() => import("@/components/PodcastPlayer"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Pocket Feed",
  description: "All of your favorite content in one place.",
};

import { getXataClient, UsersRecord } from "@/xata";
import { auth } from "@clerk/nextjs/server";

const xata = getXataClient();

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { show } = useShowPodcastPlayer();
  const { userId }: { userId: string | null } = auth();
  console.log({ userId });
  const user = (await xata.db.users
    .filter({ clerkUserId: userId })
    .getFirst()) as UsersRecord;

  const avatarUrl = user.avatar?.transform({
    width: 64,
    height: 64,
    format: "webp",
  });
  return (
    <>
      <Navigation avatarUrl={avatarUrl?.url as string} />
      {/* {show && <PodcastPlayer />} */}
      <PodcastPlayer />
      {children}
    </>
  );
}
