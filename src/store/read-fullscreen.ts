import { create } from "zustand";
import { persist } from "zustand/middleware";

type fullscreenType = {
  fullscreen: boolean | null;
  toggleFullscreen: () => void;
};

// export const useFullscreen = create<fullscreenType>((set) => ({
//   fullscreen: false,
//   toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
// }));

export const useFullscreen = create<fullscreenType>()(
  persist(
    (set, get) => ({
      fullscreen: null,
      toggleFullscreen: () => set({ fullscreen: !get().fullscreen }),
    }),
    {
      name: "fullscreen", // name of the item in the storage (must be unique)
      skipHydration: true,
    },
  ),
);
