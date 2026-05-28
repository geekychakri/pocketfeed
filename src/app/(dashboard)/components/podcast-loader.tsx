"use client";

import dynamic from "next/dynamic";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

const PodcastPlayerDynamic = dynamic(
  () => import("@/app/(dashboard)/components/podcast-player"),
  {
    ssr: false,
  },
);

export default function PodcastLoader() {
  const { show } = useShowPodcastPlayer((state) => ({ show: state.show }));

  if (!show) {
    return null;
  }

  return <PodcastPlayerDynamic />;
}
