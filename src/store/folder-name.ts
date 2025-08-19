import { create } from "zustand";

type FolderNameType = {
  folderName: string;
  setFolderName: (folderName: string) => void;
};

export const useFolderName = create<FolderNameType>((set) => ({
  folderName: "",
  setFolderName: (folderName) => set((state) => ({ folderName })),
}));
