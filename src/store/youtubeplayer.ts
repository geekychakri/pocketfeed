import { create } from "zustand";

type YoutubePlayer = {
  isOpen: boolean;
  youtubeId: string;

  ytVideoTitle: string;
  setYoutubeId: (val: string) => void;
  setYtVideoTitle: (val: string) => void;
  openYoutubePlayer: () => void;
  closeYoutubePlayer: () => void;
};

export const useShowPodcastPlayer = create<YoutubePlayer>((set) => ({
  isOpen: false,
  youtubeId: "",
  ytVideoTitle: "",
  setYoutubeId: (youtubeId: string) => set((state) => ({ youtubeId })),
  setYtVideoTitle: (ytVideoTitle: string) => set((state) => ({ ytVideoTitle })),
  openYoutubePlayer: () => set((state) => ({ isOpen: true })),
  closeYoutubePlayer: () => set((state) => ({ isOpen: false })),
}));
