import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type ToggleSidenav = {
  isOpen: boolean;
  setIsOpen: () => void;
};

export const useToggleSidenav = createWithEqualityFn<ToggleSidenav>()(
  (set) => ({
    isOpen: false,
    setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  }),
  shallow,
);
