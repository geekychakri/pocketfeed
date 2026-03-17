import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import RouteBack from "@/components/route-back";

import { db } from "@/db/db";
import { getSelectedFeeds } from "@/db/queries";
import * as schema from "@/db/schema";
import { getAllRecords } from "@/lib/atproto/queries";
import { preloadDailyFeed } from "@/lib/dal/daily-feed";
import { getXataClient } from "@/xata";

import MultipleFeedsCombobox from "./components/combo-box";
import DailyFeedList from "./components/daily-feed-list";
import SelectFeedsModal from "./components/select-feeds-modal";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[750px] border-r border-l min-h-screen shadow-[0_0px_10px_1px_var(--border-non-interactive)]">
      {/* <div className="h-14"></div> */}

      <div className="flex  justify-between gap-2 h-14 items-center border-b px-4">
        <div className="flex gap-2">
          <RouteBack />
          <h1 className="font-medium">Daily</h1>
        </div>

        {/* <div>
          <SelectFeedsModal />
        </div> */}
        <Suspense fallback="Loading...">
          <MultipleFeedsComboboxWrapper />
        </Suspense>
      </div>

      {/* <Suspense fallback="Loading...">
        <MultipleFeedsComboboxWrapper />
      </Suspense> */}
      {/*<Suspense fallback={<DailyFeedListFallback />}>*/}
      <DailyFeedList />
      {/*</Suspense>*/}
    </div>
  );
}

const MultipleFeedsComboboxWrapper = async () => {
  // const userId = (await auth()).userId as string;

  // const xata = getXataClient();

  // const feeds = (
  //   await xata.db.feeds.filter({ userId }).getAll()
  // ).toSerializable();

  // const selectedFeeds = (
  //   await xata.db.daily.filter({ userId }).getAll()
  // ).toSerializable();

  // const records = await getAllRecords();

  // const selectedFeeds =

  const [records, selectedFeeds] = await Promise.all([
    getAllRecords(),
    getSelectedFeeds(),
  ]); //filter feeds by did

  // console.log({ selectedFeeds });

  const feeds = records.map((record) => ({ ...record.value }));

  return (
    <SelectFeedsModal>
      <MultipleFeedsCombobox
        initialData={feeds}
        // selectedFeeds={selectedFeeds}
        selectedFeeds={selectedFeeds}
      />
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
