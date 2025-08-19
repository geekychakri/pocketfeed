import { create } from "zustand";

type ArticleContentType = {
  articleContent: string;
  articleTitle: string;
  setArticleData: (
    articleContent: string,
    articleTitle: string,
    isExtracted?: boolean,
  ) => void;
  isExtracted: boolean;
};

export const useArticleContent = create<ArticleContentType>((set) => ({
  articleContent: "",
  articleTitle: "",
  isExtracted: false,
  setArticleData: (
    articleContent: string,
    articleTitle: string,
    isExtracted: boolean,
  ) => set((state) => ({ articleContent, articleTitle, isExtracted })),
}));
