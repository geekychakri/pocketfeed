import { ExtractArticle } from "@/lib/extract-article";
import Article from "@/components/Article";

// import Parser from "@postlight/parser";
import RouteBack from "@/components/RouteBack/RouteBack";

import localFont from "next/font/local";

import Script from "next/script";

import { JSDOM } from "jsdom";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import ArticleSettings from "@/components/ArticleSettings";

export default async function Read({ params }: { params: { link: string } }) {
  let article;

  const articleUrl = decodeURIComponent(params.link);
  console.log({ articleUrl });
  const dom = await JSDOM.fromURL(articleUrl);

  if (isProbablyReaderable(dom.window.document)) {
    const reader = new Readability(dom.window.document);
    article = reader.parse();
    console.log(article);
  } else {
    article = null;
  }

  return (
    <main
      className={`relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-28`}
    >
      <ArticleSettings />
      <RouteBack text="Back" />
      <h1 className="text-balance text-6xl font-semibold tracking-tighter !text-text-primary">
        {article?.title}
      </h1>
      <Article content={article?.content as string} />
    </main>
  );
}
