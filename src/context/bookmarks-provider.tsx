"use client";

import React from "react";

import { createStore } from "zustand";

export const BookmarksStoreContext = React.createContext(null);

export const BookmarksStoreProvider = ({ children, initialData }) => {
  const [store] = React.useState(() =>
    createStore((set) => ({
      bookmarks: initialData,
      actions: {
        addBookmarks: (data) =>
          set((state) => ({ bookmarks: [...state.bookmarks, ...data] })),
        deleteBookmark: (id: string) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter((item) => item.id !== id),
          }));
        },
      },
    })),
  );

  return (
    <BookmarksStoreContext.Provider value={store}>
      {children}
    </BookmarksStoreContext.Provider>
  );
};
