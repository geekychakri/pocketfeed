import useSWR from "swr";

import { fetcher } from "@/lib/utils";

export default function LastBskyFollowsSyncedAt() {
  const { data, error, isLoading, isValidating } = useSWR<{
    lastBskyFollowsSyncAt: string;
  }>("/api/last-bsky-follows-sync", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 500.
      if (error.status === 500) return;

      // Only retry up to 5 times.
      if (retryCount >= 5) return;
    },
  });

  if (error) {
    return (
      <p className="text-text-secondary text-sm">
        Last synced at:{" "}
        <span className="text-danger">Unable to fetch sync details.</span>
      </p>
    );
  }

  console.log({ data });
  return (
    <p className="text-text-secondary flex items-center gap-1 text-sm">
      Last synced at:{" "}
      {isLoading || isValidating ? (
        <span className="bg-skeleton-highlight inline-block h-5 w-50 animate-pulse rounded-md"></span>
      ) : (
        <time>
          {new Date(data?.lastBskyFollowsSyncAt as string).toLocaleString()}
        </time>
      )}
    </p>
  );
}
