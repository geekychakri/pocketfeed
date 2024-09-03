import { create } from "zustand";

type YoutubePlayer = {
  isOpen: boolean;
  youtubeId: string;
  setYoutubeId: (val: string) => void;
  openYoutubePlayer: () => void;
  closeYoutubePlayer: () => void;
};

export const useShowPodcastPlayer = create<YoutubePlayer>((set) => ({
  isOpen: false,
  youtubeId: "",
  setYoutubeId: (youtubeId: string) => set((state) => ({ youtubeId })),
  openYoutubePlayer: () => set((state) => ({ isOpen: true })),
  closeYoutubePlayer: () => set((state) => ({ isOpen: false })),
}));
