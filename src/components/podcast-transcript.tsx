"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ScrollArea } from "@base-ui/react/scroll-area";
import DOMPurify from "isomorphic-dompurify";
import useSWR from "swr";
import { Virtualizer, VList, VListHandle } from "virtua";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, internalErrorToast } from "@/lib/utils";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

const secondsToHHMMSS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = Math.floor(totalSeconds % 60);

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

type TranscriptDataType = {
  parsedText: string;
  segments: [];
};

export default function PodcastTranscipt({ audioRef }: { audioRef: any }) {
  const { transcriptUrl } = useShowPodcastPlayer();
  console.log({ transcriptUrl });

  const { data, error, isLoading, mutate } = useSWR<TranscriptDataType>(
    transcriptUrl
      ? `/api/podcast-transcript?transcriptUrl=${encodeURIComponent(transcriptUrl as string)}`
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

  if (isLoading) {
    return "Loading...";
  }

  if (!transcriptUrl) {
    return <div>Transcript not found!</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">Something went wrong!</div>;
  }

  if (data?.parsedText) {
    return (
      <ScrollArea.Root className="min-h-0 flex-1">
        <ScrollArea.Viewport className="scrollable scroll-pb-6 overscroll-contain h-full flex pl-1 pr-6 py-2 flex-col gap-5 focus-visible:border-brand-shadow">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.parsedText),
            }}
            className="prose p-0 prose-a:no-underline [&_a_u]:no-underline prose-a:custom-underline dark:prose-invert min-w-0 wrap-break-word"
          ></div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm  opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0 data-[scrolling]:pointer-events-auto">
          <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    );
  }

  return <AudioHighlighter audioRef={audioRef} words={data?.segments} />;
}

function AudioHighlighter({ audioRef, words }: { audioRef: any; words: any }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const vlistRef = useRef<VListHandle>(null);
  const isRestoringFocus = useRef(false);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const activeIndexRef = useRef(-1);

  console.log("AUDIO HIGHLIGHTER");

  // Stable ref so useEffect closure never goes stale
  const setActive = useCallback((i: number) => {
    activeIndexRef.current = i;
    setActiveIndex(i);
  }, []);

  const wordIndex = useMemo(() => {
    return words.map((w: any, i: number) => ({
      startTime: w.startTime,
      endTime: w.endTime,
      index: i,
    }));
  }, [words]);

  useEffect(() => {
    const audio = audioRef.current;
    const viewport = viewportRef.current;

    let lastActiveIndex = -1;
    let isUserScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let isSeeking = false;
    let seekRafId: number | null = null;

    function findActiveIndex(t: number): number {
      let lo = 0,
        hi = wordIndex.length - 1,
        result = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (wordIndex[mid].startTime <= t) {
          result = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (result !== -1 && wordIndex[result].endTime <= t) return -1;
      return result;
    }

    const onTimeUpdate = () => {
      if (isSeeking) return; // let onSeeking handle it during seek

      const t = audio.currentTime;
      const idx = findActiveIndex(t);

      if (idx === lastActiveIndex) return;
      lastActiveIndex = idx;
      setActive(idx);

      // Auto-scroll during normal playback smooth, only when user isn't scrolling
      if (idx !== -1 && !isUserScrolling) {
        vlistRef.current?.scrollToIndex(idx, {
          align: "center",
          smooth: true,
        });
      }
    };

    const onSeeking = () => {
      isSeeking = true;
      const t = audio.currentTime;
      const idx = findActiveIndex(t);
      if (idx === -1) return;

      // Instant jump — smooth would feel laggy on seek
      // vlistRef.current?.scrollToIndex(idx, {
      //   align: "start",
      //   smooth: false,
      // });

      if (seekRafId !== null) cancelAnimationFrame(seekRafId);

      seekRafId = requestAnimationFrame(() => {
        seekRafId = null;
        lastActiveIndex = idx;
        setActive(idx);
      });
    };

    const onSeeked = () => {
      isSeeking = false;
    };

    const onUserScroll = () => {
      if (isSeeking) return;
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 2000);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("seeking", onSeeking);
    audio.addEventListener("seeked", onSeeked);
    viewport?.addEventListener("scroll", onUserScroll, { passive: true });

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("seeking", onSeeking);
      audio.removeEventListener("seeked", onSeeked);
      viewport?.removeEventListener("scroll", onUserScroll);
      clearTimeout(scrollTimeout);
      if (seekRafId !== null) cancelAnimationFrame(seekRafId);
    };
  }, [audioRef, wordIndex, setActive]); // setActive is stable via useCallback

  return (
    <ScrollArea.Root className="min-h-0 flex-1">
      <ScrollArea.Viewport
        ref={viewportRef}
        className="scroll-pb-6 overscroll-contain h-full flex pl-1 pr-5 py-2 flex-col gap-2 focus-visible:border-brand-shadow"
      >
        <Virtualizer ref={vlistRef} scrollRef={viewportRef} overscan={10}>
          {words.map((word: any, i: number) => (
            <button
              key={i}
              data-word-idx={i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                // e.preventDefault();
                audioRef.current.currentTime = word.startTime;
                if (audioRef.current.paused) {
                  audioRef.current.play();
                }
              }}
              onFocus={() => {
                if (isRestoringFocus.current) return;
                setFocusedIndex(i);
                // vlistRef.current?.scrollToIndex(i, {
                //   align: "center",
                //   smooth: false,
                // });
              }}
              onBlur={() => setFocusedIndex(-1)}
              ref={(el) => {
                if (el && i === focusedIndex) {
                  requestAnimationFrame(() => {
                    isRestoringFocus.current = true;
                    el.focus({ preventScroll: true });
                    requestAnimationFrame(() => {
                      isRestoringFocus.current = false;
                    });
                  });
                }
              }}
              className={`group mb-5 cursor-pointer scroll-mt-9 border-dashed rounded-md flex flex-col select-none text-left w-full ${
                i === activeIndex ? "active-word" : ""
              }`}
            >
              {word.speaker && (
                <span className="pt-2 px-2 text-text-secondary">
                  {word.speaker}: [{secondsToHHMMSS(word.startTime)}]
                </span>
              )}
              <span className="rounded-md p-2 group-[.active-word]:bg-brand-primary group-[.active-word]:text-white">
                {word.body}
              </span>
            </button>
          ))}
        </Virtualizer>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0 data-[scrolling]:pointer-events-auto">
        <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
