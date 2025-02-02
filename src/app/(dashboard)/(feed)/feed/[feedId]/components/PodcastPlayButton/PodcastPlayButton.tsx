"use client";
import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { PlayIcon, PauseIcon } from "@radix-ui/react-icons";

type PodcastPlayButtonType = {};

export default function PodcastPlayButton({
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
}: {
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
}) {
  // const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <button
      className={cn(
        "z-[2] flex size-10 items-center justify-center gap-1 rounded-full bg-ui-normal px-4 py-2 text-base font-medium",
        className,
      )}
      onClick={() => {
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
