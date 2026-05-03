"use client";

import { toast } from "sonner";
// import { fetcher } from "@/lib/utils";

import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { SpinnerRotate } from "@/components/spinner-rotate";

export default function RefreshDailyFeeds() {
  const { isValidating, mutate } = useSWR("/api/daily-feeds");
  return (
    <button
      className="bg-ui-normal disabled:opacity-20 px-4 py-2 rounded-md hover:bg-ui-hover cursor-pointer font-medium"
      disabled={isValidating}
      onClick={() =>
        toast.promise(mutate, {
          loading: "Refreshing daily feed...",
          success: (data) => {
            return `Daily feed refreshed`;
          },
          error: "Error",
        })
      }
    >
      Refresh
    </button>
  );
}
