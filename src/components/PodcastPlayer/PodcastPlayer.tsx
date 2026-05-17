"use client";

import React, { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelectedLayoutSegment } from "next/navigation";

import { Cross2Icon } from "@radix-ui/react-icons";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import VaulDrawer from "@/components/drawer";

import { PostIcon } from "@/icons/post";
import { useFeedItem } from "@/store/feed-item";
import { useGlobalRef } from "@/store/globalRef";
import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useFullscreen } from "@/store/read-fullscreen";
import useStore from "@/store/useStore";

import BookmarkPodcast from "../bookmark";
import CopyLink from "../copy-link";
import IconOnlyAction from "./../ui/icon-only-action";
import CustomMediaPlayer from "./custom-media-player";

const PostModal = dynamic(() => import("@/components/post-modal"), {
  ssr: false,
  loading: () => (
    <IconOnlyAction>
      <PostIcon className="size-[18px] shrink-0" />
    </IconOnlyAction>
  ),
});

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

  console.log({ podcastFeedItem: feedItem });

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
    // if (show !== "hide") audioPlayerRef.current?.play();
    // if (show !== "hide") {
    //   var playPromise = audioPlayerRef.current?.play();
    //   if (playPromise !== undefined) {
    //     playPromise
    //       .then((_) => {
    //         // Automatic playback started!
    //         // Show playing UI.
    //       })
    //       .catch((error) => {
    //         // Auto-play was prevented
    //         // Show paused UI.
    //       });
    //   }
    // }
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

  // useEffect(() => {
  //   // console.log("AUDIO CHANGED");
  //   const audio = audioPlayerRef.current;
  //   console.log({ audio });
  //   if (!audio) return;

  //   audio.play().catch(() => {});
  // }, [audioUrl, audioPlayerRef]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`bg-background-primary pb-3 fixed -bottom-72 left-0 min-md:left-[256px] animation-slide-up-player ease-out-player animate-player-slide-up right-0 z-10 flex flex-col gap-1 transition-[translate] duration-700 ${show === "hide" ? "translate-y-80" : ""}`}
    >
      <div className="flex justify-between pr-3 border-dashed-y bg-background-secondary">
        <div className="flex gap-1 items-center select-none">
          {albumCover && (
            <img src={albumCover} alt={albumName} className="size-10" />
          )}
          <div className="max-md:marquee text-sm text-text-secondary">
            <p className="max-md:marquee__content">{albumName}</p>
            <p
              className="max-md:marquee__content max-md:block hidden"
              aria-hidden={true}
            >
              {albumName}
            </p>
          </div>
        </div>

        <div className="flex gap-1 items-center shrink-0">
          <TooltipPrimitive.Provider>
            <PostModal
              iconClassName="size-4"
              customClassName="p-0 flex size-8 items-center justify-center"
              feedItemType="podcast"
            />
            {/*<BookmarkPodcast
              // bookmarked={bookmarkExists}
              bookmarkFeedItem={feedItem} //TODO:
              bookmarkLink={audioUrl}
              bookmarkType="podcast"
              // bookmarkId={bookmarkId}
              bookmarkTitle={title}
              btnClassName="p-0 flex size-8 items-center justify-center rounded-md"
              iconClassName="size-4"

            />*/}

            <VaulDrawer audioRef={audioPlayerRef} />

            <CopyLink
              link={feedItem.link}
              className="size-8"
              iconClassName="size-[18px]"
            />

            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger
                onFocus={(e) => {
                  const isFocusVisible =
                    e.currentTarget.matches(":focus-visible");
                  if (!isFocusVisible) e.preventDefault();
                }}
                asChild
              >
                <button
                  onClick={() => {
                    hidePodcastPlayer();
                    // setIsPlaying(false);
                    audioPlayerRef.current?.pause();
                  }}
                  className="flex size-8 items-center justify-center hover:bg-ui-hover rounded-full"
                >
                  <Cross2Icon className="size-4" />
                </button>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Content
                side="top"
                align="center"
                sideOffset={8}
                className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-[100] rounded px-[10px] py-[5px] text-[13px] leading-none font-medium select-none"
              >
                <span>Close</span>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
          </TooltipPrimitive.Provider>
        </div>
      </div>

      <CustomMediaPlayer title={title} albumName={albumName}>
        <audio
          slot="media"
          src={audioUrl}
          playsInline
          autoPlay
          ref={audioPlayerRef}
          // onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
          onPlay={() => setIsPlayingTrue()}
          onPause={() => setIsPlayingFalse()}
        ></audio>
      </CustomMediaPlayer>
    </div>
  );
};

export default memo(PodcastPlayer);
