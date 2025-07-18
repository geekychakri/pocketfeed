import { create } from "zustand";

type FeedItemType = {
  feedItem: any;
  setFeedItem: (feed: any) => void;
};

export const useFeedItem = create<FeedItemType>((set) => ({
  feedItem: {},
  setFeedItem: (feedItem) => set((state) => ({ feedItem })),
}));
