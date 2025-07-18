"use client";

import React, { useState, useEffect, memo } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import { useFullscreen } from "@/store/read-fullscreen";

import { useSelectedLayoutSegment } from "next/navigation";

import useStore from "@/store/useStore";

import { useShowPodcastPlayer } from "@/store/podcastplayer";
import VaulDrawer from "../Drawer";
import { useGlobalRef } from "@/store/globalRef";

import CustomMediaPlayer from "./custom-media-player";
import BookmarkPodcast from "./bookmark-podcast";
import { useFeedItem } from "@/store/feed-item";

const PodcastPlayer = () => {
  console.log("RE RENDERED");

  const fullscreen = useStore(useFullscreen, (state) => state.fullscreen);

  const segment = useSelectedLayoutSegment();

  console.log({ segment });

  const { audioPlayerRef } = useGlobalRef(); //TODO:

  // console.log({ audioPlayerRef: audioPlayerRef.current });

  const {
    closePodcastPlayer,
    albumCover,
    title,
    audioUrl,
    show,
    openPodcastPlayer,
    hidePodcastPlayer,
    isPlaying,
    setIsPlayingTrue,
    setIsPlayingFalse,
    activeEpisode,
    currentTime,
    author,
    albumName,
  } = useShowPodcastPlayer((state) => ({
    albumCover: state.albumCover,
    title: state.title,
    audioUrl: state.audioUrl,
    show: state.show,
    openPodcastPlayer: state.openPodcastPlayer,
    closePodcastPlayer: state.closePodcastPlayer,
    hidePodcastPlayer: state.hidePodcastPlayer,
    isPlaying: state.isPlaying,
    setIsPlayingTrue: state.setIsPlayingTrue,
    setIsPlayingFalse: state.setIsPlayingFalse,
    activeEpisode: state.activeEpisode,
    currentTime: state.currentTime,
    author: state.author,
    albumName: state.albumName,
  }));

  const { feedItem } = useFeedItem();

  // console.log({ albumCover });

  // references
  // const audioPlayerRef = useRef<HTMLAudioElement | null>(null); // reference our audio component

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        // artist: author || "",
        // album: albumName || "",
        artist: albumName || "",
        artwork: [
          {
            src: `https://wsrv.nl/?url=${albumCover}&w=256&h=256&af`,
            sizes: "256x256",
            type: "image/png",
          },

          {
            src: `https://wsrv.nl/?url=${albumCover}&w=512&h=512&af`,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", async () => {
        if (show !== "hide") {
          openPodcastPlayer();
          audioPlayerRef.current?.play();
        }
      });
    }
  }, [title, albumCover]);

  useEffect(() => {
    // if (show !== "hide") {
    //
    // console.log({ show });
    // }
    if (show !== "hide") audioPlayerRef.current?.play();
  }, [show]);

  useEffect(() => {
    if (!isPlaying) {
      // console.log("AUDIO  PLAYER PAUSE");
      audioPlayerRef.current?.pause();
    } else if (isPlaying) {
      // console.log("AUDIO  PLAYER PLAY");
      audioPlayerRef.current?.play();
    }
  }, [isPlaying, activeEpisode]);

  useEffect(() => {
    if (audioPlayerRef.current) {
      //TODO:: check time
      audioPlayerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    // console.log("AUDIO CHANGED");
  }, [audioUrl]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`bg-background-primary fixed -bottom-72 p-4 ${fullscreen && segment === "read" ? "left-0" : "left-[240px]"} animation-slide-up-player ease-out-player border-border-non-interactive animate-player-slide-up right-0 z-10 flex flex-col gap-1 border-t transition-[translate] duration-700 ${show === "hide" ? "translate-y-80" : ""}`}
    >
      <div className="absolute -top-[14px] flex cursor-pointer gap-2 self-end">
        {/* <button>
          <Share2Icon className="size-5" />
        </button> */}

        <BookmarkPodcast
          // bookmarked={bookmarkExists}
          bookmarkFeedItem={JSON.stringify(feedItem)} //TODO:
          bookmarkLink={audioUrl}
          bookmarkType="podcast"
          // bookmarkId={bookmarkId}
          bookmarkTitle={title}
          btnClassName="border-border-interactive bg-background-secondary flex size-7 items-center justify-center rounded-full border"
          iconClassName="size-4"
        />

        <VaulDrawer audioRef={audioPlayerRef} />
        {/* <BookmarkPodcast
          bookmarkFeedItem={JSON.stringify(feedItem)}
          bookmarkLink={audioUrl}
          bookmarkTitle={title}
          bookmarkType="podcast"
        /> */}

        <button
          onClick={() => {
            hidePodcastPlayer();
            // setIsPlaying(false);
            audioPlayerRef.current?.pause();
          }}
          className="border-border-interactive bg-background-secondary flex size-7 items-center justify-center rounded-full border"
        >
          <Cross2Icon className="size-4" />
        </button>
      </div>

      {/* <div>
        <div className="size-32 bg-yellow-300 max-sm:hidden">
          <img src={albumCover} alt="" className="max-w-full object-contain" />
        </div>
      </div> */}

      <CustomMediaPlayer title={title} albumName={albumName}>
        <audio
          slot="media"
          src={audioUrl}
          playsInline
          autoPlay
          ref={audioPlayerRef}
          onPlay={() => setIsPlayingTrue()}
          onPause={() => setIsPlayingFalse()}
        ></audio>
      </CustomMediaPlayer>
    </div>
  );
};

export default memo(PodcastPlayer);
