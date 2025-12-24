import { createRef } from "react";

import { create } from "zustand";

type GlobalRef = {
  hltrRef: any;
};

export const useHighlighterRef = create<GlobalRef>((set) => ({
  hltrRef: createRef(),
}));
