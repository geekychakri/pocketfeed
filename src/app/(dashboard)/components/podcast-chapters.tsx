import { useEffect, useRef, useState } from "react";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useSWR, { useSWRConfig } from "swr";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

import "react-loading-skeleton/dist/skeleton.css";

import { ScrollArea } from "@base-ui/react/scroll-area";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, internalErrorToast } from "@/lib/utils";

function extractText(inputString: string) {
  // Regular expression to match the timestamp and special characters
  // const pattern =
  //   /^\(?\d{1,2}:\d{2}:\d{2}\)?\s*–?\s*|\(?\d{1,2}:\d{2}\)?\s*–?\s*/;
  const pattern = /^\(?\d{1,2}:\d{2}(:\d{2})?\)?\s*[-–]?\s*/;
  // Replace the matched pattern with an empty string
  return inputString.replace(pattern, "").trim();
}

const convertTimestampToSeconds = (timeStampString: any) => {
  const timestamp = timeStampString.replace(/[()]/g, "");
  const parts = timestamp.split(":").map(Number);

  if (parts.length === 2) {
    // mm:ss format
    const [minutes, seconds] = parts;
    // setCurrentTime(minutes * 60 + seconds);
    // setIsPlayingTrue();
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // hh:mm:ss format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
    // setCurrentTime(hours * 3600 + minutes * 60 + seconds);
    // setIsPlayingTrue();
  } else {
    throw new Error("Invalid time format"); //TODO: handle error
  }
};

const toHHMMSS = (numSecs: string) => {
  let secNum = parseInt(numSecs, 10);
  let hours = Math.floor(secNum / 3600)
    .toString()
    .padStart(2, "0");
  let minutes = Math.floor((secNum % 3600) / 60)
    .toString()
    .padStart(2, "0");
  let seconds = (secNum % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export default function PodcastChapters({
  audioRef,
  guid,
}: {
  audioRef: any;
  guid: string;
}) {
  const { setCurrentTime, setIsPlayingTrue, isPlaying, feedUrl, chaptersUrl } =
    useShowPodcastPlayer();

  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { onError } = useSWRConfig();

  const { data, error, isLoading, mutate } = useSWR(
    chaptersUrl
      ? `/api/get-chapters?chaptersUrl=${encodeURIComponent(chaptersUrl)}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error, key) => {
        if (error.status === 500) {
          internalErrorToast(INTERNAL_ERROR_MESSAGE);
        }
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 500.
        if (error.status === 500) return;

        // Only retry up to 5 times.
        if (retryCount >= 5) return;
      },
    },
  );

  // useEffect(() => {
  //   if (data) {
  //     const onTimeUpdate = () => {
  //       setAudioCurrentTime(audioRef.current?.currentTime);
  //     };
  //     const audioElement = audioRef.current;
  //     audioElement.addEventListener("timeupdate", onTimeUpdate);
  //     return () => {
  //       audioElement.removeEventListener("timeupdate", onTimeUpdate);
  //     };
  //   }
  // }, [data]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !data?.chapters) return;

    let lastActiveIndex = -1;

    const onTimeUpdate = () => {
      const t = audio.currentTime;

      const activeIndex = data.chapters.findIndex(
        (chapter) =>
          t >= chapter.startTime && t < (chapter.endTime ?? audio.duration),
      );

      if (activeIndex === lastActiveIndex) {
        return;
      }

      // remove previous
      if (lastActiveIndex !== -1) {
        chapterRefs.current[lastActiveIndex]?.classList.remove("bg-ui-normal");
      }

      // add current
      if (activeIndex !== -1) {
        chapterRefs.current[activeIndex]?.classList.add("bg-ui-normal");
      }

      lastActiveIndex = activeIndex;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [audioRef, data]);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-lg">Something went wrong!</p>
        {/*<Button onClick={() => mutate()} className="self-start">
          Try again
        </Button>*/}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full animate-pulse flex-col gap-5">
        {Array.from({ length: 7 }, (_, i) => {
          return (
            <div
              key={i}
              className="bg-ui-normal flex h-12 w-full rounded-md"
            ></div>
          );
        })}
      </div>
    );
  }

  if (!chaptersUrl) {
    return <div>Chapters not found!</div>;
  }

  // return <div>{JSON.stringify(data, null, 2)}</div>;

  return (
    <ScrollArea.Root className="min-h-0 flex-1">
      <ScrollArea.Viewport className="scrollable focus-visible:border-brand-shadow flex h-full scroll-pb-6 flex-col gap-4 overscroll-contain py-2 pr-6 pl-1">
        {/*<div className="flex flex-col justify-center gap-4">*/}
        {data?.chapters?.map((chapter, i) => {
          return (
            <button
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className={`hover:bg-ui-hover h-14 w-full cursor-pointer rounded-md border-dashed px-4 py-2 text-left`}
              key={i}
              onClick={() => {
                // setCurrentTime(chapter.startTime);
                audioRef.current.currentTime = chapter.startTime;
                if (!isPlaying) {
                  setIsPlayingTrue();
                }
              }}
            >
              <span className="flex justify-between gap-4">
                <span className="flex items-center gap-2">
                  {/*{isActive ? (
                      <AnimatedMusicBars isPlaying={isPlaying} />
                    ) : null}*/}
                  <span className="line-clamp-1">
                    {chapter.title}
                    {/* {chapter?.text} */}
                  </span>
                </span>
                <span className="text-text-secondary flex-none">
                  {toHHMMSS(chapter.startTime)}
                </span>
              </span>
              {/* {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""} */}
              {/* <span>{activeIndex === i ? "Logo" : ""}</span> */}
            </button>
          );
        })}
        {/*</div>*/}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="pointer-events-none m-2 flex w-1 justify-center rounded-sm opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
        <ScrollArea.Thumb className="bg-brand-primary w-full rounded-sm" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

function AnimatedMusicBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      className={`*:bg-brand-primary *:animate-bounce-bar flex size-[13px] flex-none justify-between content-[""] *:size-[3px] *:h-full *:origin-bottom *:rounded-[3px] *:nth-of-type-2:delay-[-2.2s] *:nth-of-type-3:delay-[-3.7s] ${isPlaying ? "*:!animation-play" : "*:animation-pause!"}`}
    >
      <span />
      <span />
      <span />
    </div>
  );
}
