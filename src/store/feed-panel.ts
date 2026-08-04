import { create } from "zustand";

type FeedPanelStoreType = {
  feedPanelName: string;
  setFeedPanelName: (feedPanelName: string) => void;
};

export const useFeedPanel = create<FeedPanelStoreType>((set) => ({
  feedPanelName: "pocketfeed",
  setFeedPanelName: (feedPanelName) => set({ feedPanelName }),
}));
