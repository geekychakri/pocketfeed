import { getCookie, setCookie } from "cookies-next/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type fullscreenType = {
  fullscreen: boolean | null;
  toggleFullscreen: () => void;
  isRehydrated: boolean;
  setRehydrated: (rehydrated: boolean) => void;
};

// export const useFullscreen = create<fullscreenType>((set) => ({
//   fullscreen: false,
//   toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
// }));

export const useFullscreen = create<fullscreenType>()(
  persist(
    (set, get) => ({
      fullscreen: null,
      toggleFullscreen: () => {
        setCookie("fullscreen", !get().fullscreen);

        set({ fullscreen: !get().fullscreen });
      },
      isRehydrated: false,
      setRehydrated: (rehydrated) => set({ isRehydrated: rehydrated }),
    }),
    {
      name: "fullscreen", // name of the item in the storage (must be unique)
      // skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setRehydrated(true); // set rehydrated to true when persistence is complete
      },
    },
  ),
);
