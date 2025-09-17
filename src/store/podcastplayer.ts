import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type ShowPodcastPlayer = {
  show: boolean | string;
  openPodcastPlayer: () => void;
  closePodcastPlayer: () => void;
  hidePodcastPlayer: () => void;
  title: string;
  // podcastTitle: string;
  // setPodcastTitle: (val: string | undefined) => void;
  audioUrl: string;
  albumCover: string;
  activeEpisode: string;
  isPlaying: boolean;
  content: string;
  setContent: (val: string | undefined) => void;
  episodeNumber: string;
  setEpisodeNumber: (val: string | undefined) => void;
  currentTime: number;
  setCurrentTime: (val: number) => void;
  setIsPlayingTrue: () => void;
  setIsPlayingFalse: () => void;
  setTitle: (val: string | undefined) => void;
  setAudioUrl: (val: string | undefined) => void;
  setAlbumCover: (val: string | undefined) => void;
  setActiveEpisode: (val: string | undefined) => void;
  author: string;
  setAuthor: (val: string | undefined) => void;
  albumName: string;
  setAlbumName: (val: string | undefined) => void;
  feedUrl: string;
  setFeedUrl: (val: string | undefined) => void;
  chaptersUrl: string;
  setChaptersUrl: (val: string | undefined) => void;
};

export const useShowPodcastPlayer = createWithEqualityFn<ShowPodcastPlayer>()(
  (set) => ({
    show: false,
    title: "",
    audioUrl: "",
    albumCover: "",
    content: "",
    episodeNumber: "",
    currentTime: 0,
    setCurrentTime: (currentTime: number) => set((state) => ({ currentTime })),
    setEpisodeNumber: (episodeNumber: string | undefined) =>
      set((state) => ({ episodeNumber })),
    setContent: (content: string | undefined) => set((state) => ({ content })),
    activeEpisode: "",
    isPlaying: false,
    setIsPlayingTrue: () => set((state) => ({ isPlaying: true })),
    setIsPlayingFalse: () => set((state) => ({ isPlaying: false })),
    setActiveEpisode: (activeEpisode: string | undefined) =>
      set((state) => ({ activeEpisode })),
    openPodcastPlayer: () => set((state) => ({ show: true })),
    closePodcastPlayer: () => set((state) => ({ show: false })),
    hidePodcastPlayer: () => set((state) => ({ show: "hide" })),
    setTitle: (title: string | undefined) => set((state) => ({ title })),
    setAudioUrl: (audioUrl: string | undefined) =>
      set((state) => ({ audioUrl })),
    setAlbumCover: (albumCover: string | undefined) =>
      set((state) => ({ albumCover })),
    author: "",
    setAuthor: (author: string | undefined) => set((state) => ({ author })),
    albumName: "",
    setAlbumName: (albumName: string | undefined) =>
      set((state) => ({ albumName })),
    feedUrl: "",
    setFeedUrl: (feedUrl: string | undefined) => set((state) => ({ feedUrl })),
    chaptersUrl: "",
    setChaptersUrl: (chaptersUrl: string | undefined) =>
      set((state) => ({ chaptersUrl })),
    // podcastTitle: "",
    // setPodcastTitle: (podcastTitle: string | undefined) =>
    //   set((state) => ({ podcastTitle })),
  }),
  shallow,
);
