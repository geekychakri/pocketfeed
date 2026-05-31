"use client";

import { memo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelectedLayoutSegment } from "next/navigation";

import { Cross2Icon } from "@radix-ui/react-icons";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import VaulDrawer from "@/app/(dashboard)/components/drawer";
import { PostIcon } from "@/icons/post";
import { getInitials } from "@/lib/utils";
import { useFeedItem } from "@/store/feed-item";
import { useGlobalRef } from "@/store/globalRef";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

import IconOnlyAction from "../../../components/ui/icon-only-action";
import CopyLink from "./copy-link";

const PostModal = dynamic(
  () => import("@/app/(dashboard)/components/post-modal"),
  {
    ssr: false,
    loading: () => (
      <IconOnlyAction>
        <PostIcon className="size-4.5 shrink-0" />
      </IconOnlyAction>
    ),
  },
);

const PodcastPlayer = () => {
  console.log("RE RENDERED");

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

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
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
  }, [title, albumCover, albumName, audioPlayerRef, openPodcastPlayer, show]);

  useEffect(() => {
    const audio = audioPlayerRef.current;

    if (!audio) return;

    if (show === "hide") {
      audio.pause();
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, show, activeEpisode, audioPlayerRef]);

  useEffect(() => {
    if (audioPlayerRef.current) {
      //TODO:: check time
      audioPlayerRef.current.currentTime = currentTime;
    }
  }, [currentTime, audioPlayerRef]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`bg-background-primary animation-slide-up-player ease-out-player animate-player-slide-up fixed right-0 -bottom-72 left-0 z-10 flex flex-col gap-1 pb-3 transition-[translate] duration-700 md:left-64 ${show === "hide" ? "translate-y-80" : ""}`}
    >
      <div className="border-dashed-y bg-background-secondary flex justify-between pr-3">
        <div className="flex items-center gap-1 select-none">
          {albumCover && (
            <Avatar className="bg-ui-normal ring-ui-normal inline-flex size-10 flex-none cursor-pointer items-center justify-center overflow-hidden align-middle transition-shadow select-none">
              <AvatarImage
                className="h-full w-full object-cover"
                src={albumCover}
                alt={albumName}
              />
              <AvatarFallback
                // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
                delayMs={600}
              >
                {getInitials(albumName)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="max-md:marquee text-text-secondary text-sm">
            <p className="max-md:marquee__content">{title}</p>
            <p
              className="max-md:marquee__content hidden max-md:block"
              aria-hidden={true}
            >
              {title}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <TooltipPrimitive.Provider>
            <PostModal
              iconClassName="size-4"
              customClassName="p-0 flex size-8 items-center justify-center"
              feedItemType="podcast"
            />

            <VaulDrawer audioRef={audioPlayerRef} />

            {feedItem && (
              <CopyLink
                link={feedItem.link}
                className="size-8"
                iconClassName="size-[18px]"
              />
            )}
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
                  className="hover:bg-ui-hover flex size-8 items-center justify-center rounded-full"
                >
                  <Cross2Icon className="size-4" />
                </button>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Content
                side="top"
                align="center"
                sideOffset={8}
                className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 cursor-pointer rounded px-2.5 py-1.25 text-[13px] leading-none font-medium select-none"
              >
                <span>Close</span>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
          </TooltipPrimitive.Provider>
        </div>
      </div>

      <audio
        // slot="media"
        className="w-full focus:outline-none! focus-visible:outline-none!"
        src={audioUrl}
        playsInline
        // autoPlay
        ref={audioPlayerRef}
        // onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
        onPlay={() => {
          if (!isPlaying) setIsPlayingTrue();
        }}
        onPause={() => {
          if (isPlaying) setIsPlayingFalse();
        }}
        controls
      ></audio>
    </div>
  );
};

export default memo(PodcastPlayer);
