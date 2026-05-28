"use client";

import { useEffect, useState } from "react";

import { ScrollArea } from "@base-ui/react/scroll-area";
import localforage from "localforage";
import useSWR from "swr";

import { ERROR_MESSAGE } from "@/lib/constants";
import { fetcher } from "@/lib/utils";

import FeedLinks from "./feed-link";

type FeedDataType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
  favicon?: string;
}[];

export default function FeedList({ did }: { did: string }) {
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const [localUserFeeds, setLocalUserFeeds] = useState<FeedDataType>([]);

  const { data, error, isLoading } = useSWR<FeedDataType>(
    cacheLoaded ? `/api/get-user-feeds?did=${did}` : null,
    fetcher,
    {
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData: localUserFeeds,
      onSuccess: (data) => {
        localforage
          .setItem("user-feeds", data)
          .then(function (value) {
            console.log(value);
          })
          .catch(function (err) {
            console.log(err);
          });
      },
    },
  );

  console.log({ feedData: data });

  useEffect(() => {
    async function loadUserFeeds() {
      try {
        const feeds = await localforage.getItem<FeedDataType>("user-feeds");

        setLocalUserFeeds(feeds ?? []);
      } catch (err) {
      } finally {
        setCacheLoaded(true);
      }
    }

    loadUserFeeds();
  }, []);

  if (!cacheLoaded || (!data && isLoading)) {
    return (
      <div className="flex min-h-0 flex-1 animate-pulse scrollbar-none flex-col gap-4 overflow-y-scroll p-2 [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 20 }, (_, i) => {
          return (
            <div
              key={i}
              className="bg-skeleton-highlight h-5 w-full shrink-0 rounded-md"
            ></div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return <div className="text-danger px-4">{ERROR_MESSAGE}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.5}>
            <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
            <path strokeLinecap="round" d="M8 10h8m-8 4h5" />
          </g>
        </svg>
        No subscriptions yet!
      </div>
    );
  }

  return (
    <ScrollArea.Root className="min-h-0 flex-1">
      <ScrollArea.Viewport className="scrollable focus-visible:border-brand-shadow flex h-full scroll-p-4 flex-col gap-4 overscroll-contain px-3 py-2">
        <FeedLinks records={data} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="pointer-events-none m-2 flex w-1 justify-center rounded-sm opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
        <ScrollArea.Thumb className="bg-brand-primary w-full rounded-sm" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
