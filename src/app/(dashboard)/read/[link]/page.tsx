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
    <main className={`mx-auto flex w-full max-w-3xl flex-col px-4`}>
      {/* <ArticleSettings /> */}
      <div className="h-14 w-full"></div>

      <div className="relative flex items-center">
        <RouteBack className="absolute -left-9 border p-2" />
        <h1 className="flex h-14 items-center text-balance border text-[20px] font-medium tracking-tight !text-text-primary">
          {article?.title}
        </h1>
      </div>

      <Article content={article?.content as string} />
    </main>
  );
}
