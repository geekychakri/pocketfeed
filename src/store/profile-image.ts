import { create } from "zustand";

type AvatarType = {
  avatar: string;
  updateAvatar: (url: string) => void;
};

export const useAvatar = create<AvatarType>((set) => ({
  avatar: "",
  updateAvatar: (url) => set((state) => ({ avatar: url })),
}));
