import { create } from "zustand";

import type { FeedItemType } from "@/types";

type FeedItemStoreType = {
  feedItem: FeedItemType | null;
  setFeedItem: (feedItem: FeedItemType) => void;
};

export const useFeedItem = create<FeedItemStoreType>((set) => ({
  feedItem: null,

  setFeedItem: (feedItem) => set({ feedItem }),
}));
