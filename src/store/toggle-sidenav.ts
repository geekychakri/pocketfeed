import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type ToggleSidenav = {
  isOpen: boolean;
  toggleIsOpen: () => void;
};

export const useToggleSidenav = createWithEqualityFn<ToggleSidenav>()(
  (set) => ({
    isOpen: false,
    toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  }),
  shallow,
);
