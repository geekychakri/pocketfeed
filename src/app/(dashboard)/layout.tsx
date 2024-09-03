// import type { Metadata } from "next";
"use client";
import dynamic from "next/dynamic";
import "./../globals.css";

import Navigation from "@/components/Navigation";
// import PodcastPlayer from "@/components/PodcastPlayer";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

const PodcastPlayer = dynamic(() => import("@/components/PodcastPlayer"), {
  ssr: false,
});

// export const metadata: Metadata = {
//   title: "Pocket Feed",
//   description: "All of your favorite content in one place.",
// };

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { show } = useShowPodcastPlayer();
  return (
    <>
      <Navigation />
      {show && <PodcastPlayer />}
      {children}
    </>
  );
}
