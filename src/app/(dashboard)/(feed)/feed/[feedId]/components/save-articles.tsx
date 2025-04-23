"use client";
import { useEffect } from "react";
import { useArticles } from "@/store/articles-list";

import dayjs from "dayjs";
export default function SaveArticles({ feedList }: { feedList: any }) {
  console.log({ feedList });
  const articlesList = feedList.items
    .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1))
    .slice(0, 10);
  // .map((item, _) => ({
  //   articleTitle: item.title,
  //   articleLink: item.link,
  // }));
  const { setArticles, setArticleMetaData } = useArticles();

  useEffect(() => {
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => useArticles.persist.rehydrate()),
    );
  }, []);

  useEffect(() => {
    if (!setArticles) {
      return;
    }

    setArticles(articlesList);
    setArticleMetaData({
      title: feedList.title,
      // albumCover: "",
      websiteLink: feedList.link,
    });
  }, [setArticles]);
  return null;
}
