"use client";

import { useEffect } from "react";

import { PlayIcon } from "@radix-ui/react-icons";

import { useShowPodcastPlayer } from "@/store/youtubeplayer";
export default function YouTubePlayButton({
  youtubeId,
}: {
  youtubeId: string;
}) {
  const { openYoutubePlayer, setYoutubeId, isOpen } = useShowPodcastPlayer();

  // useEffect(() => {
  //   isOpen
  //     ? ((document.body.style.overflowY = "hidden"),
  //       (document.documentElement.style.scrollbarGutter = "stable"))
  //     : ((document.body.style.overflowY = "auto"),
  //       (document.documentElement.style.scrollbarGutter = "auto"));
  // }, [isOpen]);
  return (
    <button
      onClick={() => {
        openYoutubePlayer();
        setYoutubeId(youtubeId);
      }}
      className="flex items-center gap-1 rounded-md border-2 bg-white px-4 py-1 text-base font-medium text-[#e62117]"
    >
      <span>
        <PlayIcon className="size-5" />
      </span>
      <span>Play</span>
    </button>
  );
}
