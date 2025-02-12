"use client";

import React from "react";
import { createStore } from "zustand";

export const FolderFeedStoreContext = React.createContext(null);

export const FolderFeedStoreProvider = ({ children, initialData }) => {
  const [store] = React.useState(() =>
    createStore((set) => ({
      feeds: initialData,
      actions: {
        addFeed: (data) =>
          set((state) => ({ feeds: [...state.feeds, ...data] })),
        deleteFeed: (id: string) => {
          set((state) => ({
            feeds: state.feeds.filter((item) => item.id !== id),
          }));
        },
      },
    })),
  );

  return (
    <FolderFeedStoreContext.Provider value={store}>
      {children}
    </FolderFeedStoreContext.Provider>
  );
};
