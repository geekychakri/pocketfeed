"use client";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

export default function PodcastTranscipt() {
  const { chaptersUrl } = useShowPodcastPlayer();

  return <div>{chaptersUrl}</div>;
}
