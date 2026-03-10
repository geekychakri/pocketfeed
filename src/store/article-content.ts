import { create } from "zustand";

type ArticleContentType = {
  articleContent: string;
  articleTitle: string;
  articleLink: string;
  setArticleData: (
    articleContent: string,
    articleTitle: string,
    articleLink: string,
    isExtracted?: boolean,
  ) => void;
  isExtracted: boolean;
};

export const useArticleContent = create<ArticleContentType>((set) => ({
  articleContent: "",
  articleTitle: "",
  articleLink: "",
  isExtracted: false,
  setArticleData: (
    articleContent: string,
    articleTitle: string,
    articleLink: string,
    isExtracted?: boolean,
  ) =>
    set((state) => ({
      articleContent,
      articleTitle,
      articleLink,
      isExtracted,
    })),
}));
