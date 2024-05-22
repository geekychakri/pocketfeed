import { create } from "zustand";

type OPMLFeedType = {
  feeds: {
    name: string;
    url: string;
    feed: string;
  }[];
  addFeed: (data: any) => void;
};

export const useOPMLFeed = create<OPMLFeedType>((set) => ({
  feeds: [],
  addFeed: (data: any) => set((state) => ({ feeds: data })),
}));
