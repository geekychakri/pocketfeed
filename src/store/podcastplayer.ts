import { create } from "zustand";

type ShowPodcastPlayer = {
  show: boolean | string;
  openPodcastPlayer: () => void;
  closePodcastPlayer: () => void;
  hidePodcastPlayer: () => void;
  title: string;
  audioUrl: string;
  albumCover: string;
  setTitle: (val: string) => void;
  setAudioUrl: (val: string) => void;
  setAlbumCover: (val: string) => void;
};

export const useShowPodcastPlayer = create<ShowPodcastPlayer>((set) => ({
  show: false,
  title: "",
  audioUrl: "",
  albumCover: "",
  openPodcastPlayer: () => set((state) => ({ show: true })),
  closePodcastPlayer: () => set((state) => ({ show: false })),
  hidePodcastPlayer: () => set((state) => ({ show: "hide" })),
  setTitle: (title: string) => set((state) => ({ title })),
  setAudioUrl: (audioUrl: string) => set((state) => ({ audioUrl })),
  setAlbumCover: (albumCover: string) => set((state) => ({ albumCover })),
}));
