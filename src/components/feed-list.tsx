"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
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
  const { data, error, isLoading } = useSWR<FeedDataType>(
    `/api/get-user-feeds?did=${did}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-2 flex flex-col gap-4 flex-1 min-h-0 overflow-y-scroll scrollbar-none [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 20 }, (_, i) => {
          return (
            <div
              key={i}
              className="bg-skeleton-highlight rounded-md h-5 w-full shrink-0"
            ></div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return <div className="px-4 text-danger">{ERROR_MESSAGE}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-3 text-sm flex flex-col gap-3 flex-1 justify-center items-center">
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
      <ScrollArea.Viewport className="scrollable overscroll-contain h-full flex scroll-p-4 px-3 py-2 flex-col gap-4 focus-visible:border-brand-shadow">
        <FeedLinks records={data} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm  opacity-0 transition-opacity pointer-events-none data-hovering:opacity-100 data-hovering:delay-0 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto">
        <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
