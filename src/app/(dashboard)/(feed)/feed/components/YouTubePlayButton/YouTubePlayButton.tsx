"use client";

import { useEffect } from "react";

import { PlayIcon } from "@radix-ui/react-icons";
import useSound from "use-sound";

import { cn } from "@/lib/utils";
import { useCurrentBookmarkId } from "@/store/bookmark-id-store";
import { useFeedItem } from "@/store/feed-item";
import { useGlobalRef } from "@/store/globalRef";
import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useShowPodcastPlayer as useShowYTPlayer } from "@/store/youtubeplayer";

export default function YouTubePlayButton({
  feedItem,
  ytVideoTitle,
  youtubeId,
  className,
  showText,
  bookmarkId,
}: {
  feedItem?: any;
  ytVideoTitle: string;
  youtubeId: string;
  className?: string;
  showText?: boolean;
  bookmarkId?: string;
}) {
  console.log({ youtubeId });
  console.log({ feedYTItem: feedItem });
  const { openYoutubePlayer, setYoutubeId, isOpen, setYtVideoTitle } =
    useShowYTPlayer();
  const { setFeedItem } = useFeedItem();
  const { setYtBookmarkId } = useCurrentBookmarkId();

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
        setYtVideoTitle(ytVideoTitle);
        setFeedItem(feedItem); //TODO:
        audioPlayerRef.current?.pause();
        tap();
        setYtBookmarkId(bookmarkId as string); //TODO:: for handling bookmarks in bookmarks page to delete
        // save item in a localStorage for a post share
        localStorage.setItem("feedItem", JSON.stringify(feedItem));
      }}
      className={cn(
        "bg-ui-normal hover:bg-ui-hover flex size-10 cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-base font-medium will-change-[transform] transition-transform duration-150 active:scale-95",
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
