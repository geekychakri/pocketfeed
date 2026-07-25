import { create } from "zustand";

type FeedbinStoreType = {
  openFeedbinPanel: boolean;
  setOpenFeedbinPanel: (openFeedbinPanel: boolean) => void;
};

export const useFeedbinPanel = create<FeedbinStoreType>((set) => ({
  openFeedbinPanel: false,
  setOpenFeedbinPanel: (openFeedbinPanel) => set({ openFeedbinPanel }),
}));
