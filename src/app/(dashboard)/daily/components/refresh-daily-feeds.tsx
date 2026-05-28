"use client";

import { toast } from "sonner";
import useSWR from "swr";

export default function RefreshDailyFeeds() {
  const { isValidating, mutate } = useSWR("/api/daily-feeds");
  return (
    <button
      className="bg-ui-normal hover:bg-ui-hover cursor-pointer rounded-md px-4 py-2 font-medium disabled:opacity-20"
      disabled={isValidating}
      onClick={() =>
        toast.promise(mutate, {
          loading: "Refreshing daily feed...",
          success: (data) => {
            return `Daily feed refreshed`;
          },
          error: "Unable to refresh feeds!",
        })
      }
    >
      Refresh
    </button>
  );
}
