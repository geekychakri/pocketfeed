"use client";

import { useEffect } from "react";

import { useShowPodcastPlayer } from "@/store/youtubeplayer";
export default function YouTubePlayButton({
  youtubeId,
}: {
  youtubeId: string;
}) {
  const { openYoutubePlayer, setYoutubeId, isOpen } = useShowPodcastPlayer();

  useEffect(() => {
    isOpen
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "auto");
  }, [isOpen]);
  return (
    <button
      onClick={() => {
        openYoutubePlayer();
        setYoutubeId(youtubeId);
      }}
      className="rounded-md border-2 px-4 py-2"
    >
      Play
    </button>
  );
}
