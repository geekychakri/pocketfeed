import { create } from "zustand";

type ArticleContentType = {
  articleContent: string;
  articleTitle: string;
  articleLink: string;
  isExtracted: boolean;
  setArticleContent: (data: string) => void;
  setArticleTitle: (data: string) => void;
  setArticleLink: (data: string) => void;
  setIsArticleExtracted: (data: boolean) => void;
};

export const useArticleContent = create<ArticleContentType>((set) => ({
  articleContent: "",
  articleTitle: "",
  articleLink: "",
  isExtracted: false,
  setArticleContent: (articleContent: string) =>
    set(() => ({ articleContent })),
  setArticleTitle: (articleTitle: string) => set(() => ({ articleTitle })),
  setArticleLink: (articleLink: string) => set(() => ({ articleLink })),
  setIsArticleExtracted: (isExtracted: boolean) => set(() => ({ isExtracted })),
}));
