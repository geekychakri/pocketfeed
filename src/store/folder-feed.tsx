// import { create } from "zustand";

// type Item = {
//   id: string;
// };

// type FolderFeedType = {
//   feeds: Item[];
//   deleteFeed: (id: string) => void;
// };

// export const useFolderFeed = create<FolderFeedType>((set) => ({
//   feeds: [],
//   deleteFeed: (id: string) => {
//     set((state) => ({
//       feeds: state.feeds.filter((item) => item.id !== id),
//     }));
//   },
// }));

// import React from "react";
// import { createStore, useStore } from "zustand";

// export const FolderFeedStoreContext = React.createContext(null);

// export const FolderFeedStoreProvider = ({ children, initialData }) => {
//   const [store] = React.useState(() =>
//     createStore((set) => ({
//       feeds: initialData,
//       actions: {
//         increasePopulation: (by) =>
//           set((state) => ({ feeds: state.feeds + by })),
//         removeAllFeeds: () => set({ feeds: 0 }),
//       },
//     })),
//   );

//   return (
//     <FolderFeedStoreContext.Provider value={store}>
//       {children}
//     </FolderFeedStoreContext.Provider>
//   );
// };

import React from "react";
import { useStore } from "zustand";
import { FolderFeedStoreContext } from "@/context/folder-feed-provider";

export const useFolderFeedStore = (selector) => {
  const store = React.useContext(FolderFeedStoreContext);
  console.log({ store });
  if (!store) {
    throw new Error("Missing FolderFeedStoreContext.Provider");
  }
  return useStore(store, selector);
};
