import { create } from "zustand";

type bookmarkIdType = {
  ytbookmarkId: string;
  podcastBookmarkId: string;
  articleBookmarkId: string;
  setYtBookmarkId: (id: string) => void;
  setPodcastBookmarkId: (id: string) => void;
  setArticleBookmarkId: (id: string) => void;
};

export const useCurrentBookmarkId = create<bookmarkIdType>((set) => ({
  ytbookmarkId: "",
  podcastBookmarkId: "",
  articleBookmarkId: "",
  setYtBookmarkId: (id: string) => set((state) => ({ ytbookmarkId: id })),
  setPodcastBookmarkId: (id: string) =>
    set((state) => ({ podcastBookmarkId: id })),
  setArticleBookmarkId: (id: string) =>
    set((state) => ({ articleBookmarkId: id })),
}));
