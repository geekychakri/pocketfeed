import { create } from "zustand";

type ArticleHighlightsType = {
  highlights: [];
  setHighlights: (data: any) => void;
};

export const useArticleHighlights = create<ArticleHighlightsType>((set) => ({
  highlights: [],
  setHighlights: (data: any) => set((state) => ({ highlights: data })),
}));
