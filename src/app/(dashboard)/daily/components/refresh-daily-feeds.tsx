"use client";

import { toast } from "sonner";
import useSWR from "swr";

class StatusError extends Error {
  info: string | undefined;
  status: number | undefined;
}

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const res = await fetch(input, {
    ...init,
    headers: {
      "pf-user-timezone": timezone,
    },
  });
  if (!res.ok) {
    const error = new StatusError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export default function RefreshDailyFeeds() {
  const { data, isValidating, mutate } = useSWR<{ userHasFeeds: boolean }>(
    "/api/daily-feeds",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  );

  if (!data?.userHasFeeds) {
    return null;
  }

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
