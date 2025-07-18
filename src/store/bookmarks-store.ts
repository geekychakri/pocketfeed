import { create } from "zustand";

type BookmarksStoreType = {
  bookmarks: any;
  addBookmarks: (feed: any) => void;
  deleteBookmark: (id: string) => void;
};

export const useNewBookmarksStore = create<BookmarksStoreType>((set) => ({
  bookmarks: fetch("http://localhost:3000/api/getBookmarks").then((res) =>
    res.json(),
  ),
  addBookmarks: (data: any) =>
    set((state) => ({ bookmarks: [...state.bookmarks, ...data] })),
  deleteBookmark: (id: string) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((item) => item.id !== id),
    })),
}));
