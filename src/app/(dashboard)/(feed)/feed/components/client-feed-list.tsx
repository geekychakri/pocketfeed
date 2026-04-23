"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { SWRConfig, useSWRConfig } from "swr";

// import FeedList from "./feed-list";

// import SuspenseOnSearchInner from "./suspense-on-search";

const FeedList = dynamic(() => import("./feed-list"), {
  ssr: false,
});

// const SuspenseOnSearchInner = dynamic(() => import("./suspense-on-search"), {
//   ssr: false,
// });

export default function FeedListClient() {
  const sp = useSearchParams();

  return (
    <Suspense key={sp.toString()} fallback="loading...">
      <FeedList />
    </Suspense>
  );
}

function FeedListFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-5 px-4">
      <div className="h-7 w-56 bg-ui-normal rounded"></div>
      <div className="flex flex-col  space-y-3">
        <div className="h-14 w-full flex justify-between items-center">
          <div className="rounded bg-ui-normal h-7 w-56"></div>
          <div className="rounded bg-ui-normal h-7 w-20"></div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 rounded bg-ui-normal"></div>
          <div className="h-5 rounded bg-ui-normal"></div>
          <div className="h-5 rounded bg-ui-normal"></div>
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, i, a) => {
        return (
          <div key={i} className="flex flex-col  space-y-3 ">
            <div className="h-14 w-full flex justify-between items-center">
              <div className="rounded bg-ui-normal h-7 w-56"></div>
              <div className="rounded bg-ui-normal h-7 w-20"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-5 rounded bg-ui-normal"></div>
              <div className="h-5 rounded bg-ui-normal"></div>
              <div className="h-5 rounded bg-ui-normal"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
