import { useEffect, useRef } from "react";

import useSWR from "swr";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

import "react-loading-skeleton/dist/skeleton.css";

import { ScrollArea } from "@base-ui/react/scroll-area";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, internalErrorToast } from "@/lib/utils";

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

type DataResponseType = {
  chapters: {
    title: string;
    startTime: string;
    endTime: string;
  }[];
};

export default function PodcastChapters({
  audioRef,
  guid,
}: {
  audioRef: any;
  guid: string;
}) {
  const { setIsPlayingTrue, isPlaying, chaptersUrl } = useShowPodcastPlayer();

  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { data, error, isLoading } = useSWR<DataResponseType>(
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

  return (
    <ScrollArea.Root className="min-h-0 flex-1">
      <ScrollArea.Viewport className="scrollable focus-visible:border-brand-shadow flex h-full scroll-pb-6 flex-col gap-4 overscroll-contain py-2 pr-6 pl-1">
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
                  <span className="line-clamp-1">{chapter.title}</span>
                </span>
                <span className="text-text-secondary flex-none">
                  {toHHMMSS(chapter.startTime)}
                </span>
              </span>
            </button>
          );
        })}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="pointer-events-none m-2 flex w-1 justify-center rounded-sm opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
        <ScrollArea.Thumb className="bg-brand-primary w-full rounded-sm" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
