"use client";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

import dynamic from "next/dynamic";

const PodcastPlayerDynamic = dynamic(() => import("./PodcastPlayer"), {
  ssr: false,
});

export default function PodcastLoader() {
  const { show } = useShowPodcastPlayer((state) => ({ show: state.show }));

  if (!show) {
    return null;
  }

  return <PodcastPlayerDynamic />;
}
