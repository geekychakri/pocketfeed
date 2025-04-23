import { create } from "zustand";
import { persist } from "zustand/middleware";

type ArticleMetaDataType = {
  title: string;
  albumCover?: string;
  websiteLink: string;
};

type ArticlesType = {
  articles: [];
  articleMetaData: ArticleMetaDataType;
  setArticles: (data: any) => void;
  setArticleMetaData: (data: any) => void;
};

export const useArticles = create<ArticlesType>()(
  persist(
    (set, get) => ({
      articles: [],
      articleMetaData: {
        title: "",
        albumCover: "",
        websiteLink: "",
      },
      setArticles: (data) => set((state) => ({ articles: data })),
      setArticleMetaData: (data) =>
        set((state) => ({
          articleMetaData: {
            ...state.articleMetaData,
            ...data,
          },
        })),
    }),
    {
      name: "article-vault", // name of the item in the storage (must be unique)
      skipHydration: true,
    },
  ),
);
