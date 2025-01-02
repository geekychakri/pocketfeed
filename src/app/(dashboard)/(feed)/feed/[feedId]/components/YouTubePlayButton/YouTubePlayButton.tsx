"use client";

import { useEffect } from "react";

import { PlayIcon } from "@radix-ui/react-icons";

import { useShowPodcastPlayer as useShowYTPlayer } from "@/store/youtubeplayer";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

import { cn } from "@/lib/utils";

import { useGlobalRef } from "@/store/globalRef";
export default function YouTubePlayButton({
  youtubeId,
  className,
}: {
  youtubeId: string;
  className?: string;
}) {
  const { openYoutubePlayer, setYoutubeId, isOpen } = useShowYTPlayer();

  const { audioPlayerRef } = useGlobalRef();

  const { isPlaying } = useShowPodcastPlayer();

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

        audioPlayerRef.current?.pause();
      }}
      className={cn(
        "flex h-10 w-28 items-center justify-center gap-1 rounded-md border-2 border-primary bg-white px-4 py-2 text-base font-medium",
        className,
      )}
    >
      <span>
        <PlayIcon className="size-5" />
      </span>
      <span>Play</span>
    </button>
  );
}
