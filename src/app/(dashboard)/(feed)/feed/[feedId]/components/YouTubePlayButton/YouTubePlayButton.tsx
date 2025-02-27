"use client";

import { useEffect } from "react";

import { PlayIcon } from "@radix-ui/react-icons";

import { useShowPodcastPlayer as useShowYTPlayer } from "@/store/youtubeplayer";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

import useSound from "use-sound";

import { cn } from "@/lib/utils";

import { useGlobalRef } from "@/store/globalRef";
export default function YouTubePlayButton({
  youtubeId,
  className,
  showText,
}: {
  youtubeId: string;
  className?: string;
  showText?: boolean;
}) {
  console.log({ youtubeId });
  const { openYoutubePlayer, setYoutubeId, isOpen } = useShowYTPlayer();

  const [tap] = useSound("/sounds/tap.wav");

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
        tap();
      }}
      className={cn(
        "flex size-10 items-center justify-center gap-1 rounded-full bg-ui-normal px-4 py-2 text-base font-medium transition-transform will-change-transform active:scale-95",
        className,
      )}
    >
      <span>
        <PlayIcon className="size-5" />
      </span>
      {showText && <span>Play</span>}
    </button>
  );
}
