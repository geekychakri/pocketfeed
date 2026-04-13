import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";
import { SWRConfig } from "swr";

import RouteBack from "@/components/route-back";
import { SpinnerRotate } from "@/components/spinner-rotate";

import { db } from "@/db/db";
import { getSelectedFeeds, getUserFeeds } from "@/db/queries";
import * as schema from "@/db/schema";
import { getAllRecords } from "@/lib/atproto/queries";
// import { preloadDailyFeed } from "@/lib/dal/daily-feed";
import { getXataClient } from "@/xata";

import MultipleFeedsCombobox from "./components/combo-box";
import DailyFeedList from "./components/daily-feed-list";
import DailyFeedListSuspense from "./components/daily-feed-list-suspense";
import SelectFeedsModal from "./components/select-feeds-modal";

export default function Page() {
  const getSelectedFeedsPromise = getSelectedFeeds();
  const getUserFeedsPromise = getUserFeeds();
  return (
    <div className="mx-auto w-full max-w-[750px] border-r border-l min-h-screen shadow-[0_0px_10px_1px_var(--border-non-interactive)]">
      <div className="flex  justify-between gap-2 h-14 items-center border-b px-4">
        <div className="flex gap-2">
          <RouteBack />
          <h1 className="font-medium">Daily</h1>
        </div>
        <SWRConfig
          value={{
            fallback: {
              "/api/get-daily-feeds": getSelectedFeedsPromise,
              "/api/get-user-feeds": getUserFeedsPromise,
            },
          }}
        >
          <Suspense
            fallback={
              <button className="flex gap-2 h-10 items-center justify-center rounded-md bg-ui-normal px-3.5 text-base font-medium  select-none hover:bg-ui-hover active:bg-ui-active focus-visible:outline 2 focus-visible:-outline-offset-1">
                Select Feeds
                <span>
                  <SpinnerRotate />
                </span>
              </button>
            }
          >
            <SelectFeedsModal>
              <MultipleFeedsCombobox />
            </SelectFeedsModal>
          </Suspense>
        </SWRConfig>
      </div>

      {/*<Suspense fallback={<DailyFeedListFallback />}>*/}
      {/*<DailyFeedList />*/}
      <Suspense
        fallback={
          <div className="animate-pulse flex flex-col gap-5 px-4 mt-5">
            <p>Preparing your daily brew...</p>
          </div>
        }
      >
        <DailyFeedListSuspense />
      </Suspense>
      {/*</Suspense>*/}
    </div>
  );
}

const MultipleFeedsComboboxWrapper = () => {
  return (
    <SelectFeedsModal>
      <MultipleFeedsCombobox />
    </SelectFeedsModal>
  );
};

function DailyFeedListFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-5 px-4 mt-5">
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
