import { Suspense } from "react";

import { auth } from "@clerk/nextjs/server";

import RouteBack from "@/components/route-back";

import { db } from "@/db/db";
import { getSelectedFeeds } from "@/db/queries";
import * as schema from "@/db/schema";
import { getAllRecords } from "@/lib/atproto/queries";
import { getXataClient } from "@/xata";

import MultipleFeedsCombobox from "./components/combo-box";
import DailyFeedList from "./components/daily-feed-list";
import SelectFeedsModal from "./components/select-feeds-modal";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[750px] border-r border-l min-h-screen">
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
      <Suspense fallback="loading feeds...">
        <DailyFeedList />
      </Suspense>
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
