import { createRef } from "react";

import { create } from "zustand";

type GlobalRef = {
  audioPlayerRef: React.RefObject<HTMLAudioElement | null>;
};

export const useGlobalRef = create<GlobalRef>((set) => ({
  audioPlayerRef: createRef<HTMLAudioElement>(),
}));
