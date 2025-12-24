import { create } from "zustand";
import { persist } from "zustand/middleware";

type toggleNotebookType = {
  isNotebookOpen: boolean | null;
  toggleNotebook: () => void;
  isNotebookRehydrated: boolean;
  setIsNotebookRehydrated: (rehydrated: boolean) => void;
};

// export const useFullscreen = create<fullscreenType>((set) => ({
//   fullscreen: false,
//   toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
// }));

export const useToggleNotebook = create<toggleNotebookType>()(
  persist(
    (set, get) => ({
      isNotebookOpen: null,
      toggleNotebook: () => set({ isNotebookOpen: !get().isNotebookOpen }),
      isNotebookRehydrated: false,
      setIsNotebookRehydrated: (rehydrated) =>
        set({ isNotebookRehydrated: rehydrated }),
    }),
    {
      name: "isNotebookOpen", // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        state?.setIsNotebookRehydrated(true); // set rehydrated to true when persistence is complete
      },
    },
  ),
);
