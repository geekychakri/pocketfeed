import useSWR, { mutate } from "swr";

// import User from "types/user";
import { fetcher } from "@/lib/utils";

const key = "/api/daily-feeds";

if (typeof window !== "undefined") {
  const data = localStorage.getItem(key);
  if (data) mutate(key, JSON.parse(data), false);
}

export function useDailyFeeds() {
  return useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess(user) {
      localStorage.setItem(key, JSON.stringify(user));
    },
    onError() {
      localStorage.removeItem(key);
    },
  });
}
