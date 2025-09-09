"use client";
import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useState, MouseEvent } from "react";

import { cn } from "@/lib/utils";

import { PlayIcon, PauseIcon } from "@radix-ui/react-icons";
import useSound from "use-sound";
import { useFeedItem } from "@/store/feed-item";
import { useCurrentBookmarkId } from "@/store/bookmark-id-store";

type PodcastPlayButtonType = {};

export default function PodcastPlayButton({
  feedItem,
  className,
  title,
  albumCover,
  audioUrl,
  episodeNumber,
  content,
  author,
  albumName,
  feedUrl,
  chaptersUrl,
  showText,
  bookmarkId,
}: {
  feedItem?: any;
  className?: string;
  title?: string; //TODO:  Optional for podcast drawer component
  audioUrl?: string;
  albumCover?: string;
  episodeNumber?: string;
  content?: string;
  author?: string;
  albumName?: string;
  feedUrl?: string;
  chaptersUrl?: string;
  showText?: boolean;
  bookmarkId?: string;
}) {
  // const [isPlaying, setIsPlaying] = useState(false);
  const { setPodcastBookmarkId } = useCurrentBookmarkId();
  const {
    openPodcastPlayer,
    setAlbumCover,
    setTitle,
    setAudioUrl,
    activeEpisode,
    setActiveEpisode,
    isPlaying,
    setIsPlayingTrue,
    setIsPlayingFalse,
    show,
    setContent,
    setEpisodeNumber,
    setAlbumName,
    setAuthor,
    setFeedUrl,
    setChaptersUrl,
  } = useShowPodcastPlayer();

  const { setFeedItem } = useFeedItem();

  // const [tap] = useSound("/sounds/tap.wav");

  return (
    <button
      className={cn(
        // "bg-ui-normal z-2 flex size-11 flex-none items-center justify-center gap-1 rounded-full px-4 py-2 text-base font-medium transition-transform will-change-transform active:scale-95",
        "bg-ui-normal hover:border-brand-shadow hover:bg-ui-hover flex size-10 cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-base font-medium duration-150 active:scale-95",
        activeEpisode == episodeNumber && isPlaying && "border-brand-shadow",
        className,
      )}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        // tap();
        if (activeEpisode == episodeNumber && isPlaying) {
          console.log("PREVIOUS CLICK");
          setIsPlayingFalse();
          openPodcastPlayer();
          return;
        } else if (activeEpisode == episodeNumber && !isPlaying) {
          console.log("PREVIOUS CLICK");
          setIsPlayingTrue();
          openPodcastPlayer();
          return;
        }
        // if (show) {
        //   setAlbumCover(albumCover);
        //   setTitle(title);
        //   setAudioUrl(audioUrl);
        //   setIsPlayingTrue();
        //   setActiveEpisode(episodeNumber);
        //   return;
        // }
        console.log("CLICKED");
        openPodcastPlayer();
        setAlbumCover(albumCover);
        setTitle(title);
        setAudioUrl(audioUrl);
        setIsPlayingTrue();
        setActiveEpisode(episodeNumber);
        setContent(content);
        setEpisodeNumber(episodeNumber);
        setAlbumName(albumName);
        setAuthor(author);
        setFeedUrl(feedUrl);
        setChaptersUrl(chaptersUrl);
        setFeedItem({
          ...JSON.parse(feedItem),
          albumName,
          albumCover,
        }); //TODO:
        setPodcastBookmarkId(bookmarkId as string); //TODO:: for handling bookmarks in bookmarks page to delete
      }}
    >
      {activeEpisode == episodeNumber && isPlaying ? (
        <>
          <span>
            <PauseIcon className="size-5" />
          </span>
          {showText && <span>Pause</span>}
        </>
      ) : (
        <>
          <span>
            <PlayIcon className="size-5" />
          </span>
          {showText && <span>Play</span>}
        </>
      )}
    </button>
  );
}
