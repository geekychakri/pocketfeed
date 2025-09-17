import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type YoutubePlayer = {
  bears: number;
  fish: number;
  setBears: () => void;
  setFish: () => void;
};

export const useTestStore = createWithEqualityFn<YoutubePlayer>()(
  (set) => ({
    bears: 0,
    fish: 0,
    setBears: () => set((state) => ({ bears: state.bears + 1 })),
    setFish: () => set((state) => ({ fish: state.fish + 1 })),
  }),
  shallow,
);
