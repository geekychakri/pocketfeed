import RouteBack from "@/components/route-back";

import DailyFeedList from "./components/daily-feed-list";
import RefreshDailyFeeds from "./components/refresh-daily-feeds";

export default function Page() {
  return (
    <div className="border-dashed-x relative mx-auto min-h-screen w-full max-w-187.5">
      <div className="border-dashed-b flex h-14 items-center justify-between gap-2 px-4">
        <div className="relative flex gap-2">
          <RouteBack className="absolute -left-12" />
          <h1 className="font-medium">Daily</h1>
        </div>
        <RefreshDailyFeeds />
      </div>

      <DailyFeedList />
    </div>
  );
}
