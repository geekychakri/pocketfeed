import RouteBack from "@/components/route-back";

import DailyFeedList from "./components/daily-feed-list";
import RefreshDailyFeeds from "./components/refresh-daily-feeds";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[750px] min-h-screen  border-dashed-x relative">
      <div className="flex  justify-between gap-2 h-14 items-center border-dashed-b  px-4">
        <div className="flex gap-2 relative">
          <RouteBack className="absolute -left-12" />
          <h1 className="font-medium">Daily</h1>
        </div>
        <RefreshDailyFeeds />
      </div>

      <DailyFeedList />
    </div>
  );
}
