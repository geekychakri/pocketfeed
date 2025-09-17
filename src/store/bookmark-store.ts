import React from "react";

import { useStore } from "zustand";

import { BookmarksStoreContext } from "@/context/bookmarks-provider";

export const useBookmarksStore = (selector) => {
  const store = React.useContext(BookmarksStoreContext);
  // console.log({ store });
  if (!store) {
    throw new Error("Missing BookmarksStoreContext.Provider");
  }
  return useStore(store, selector);
};
