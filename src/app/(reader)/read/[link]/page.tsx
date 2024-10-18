import { ExtractArticle } from "@/lib/extract-article";
import Article from "@/components/Article";

// import Parser from "@postlight/parser";
import RouteBack from "@/components/RouteBack/RouteBack";

import { JSDOM } from "jsdom";
import { Readability, isProbablyReaderable } from "@mozilla/readability";

export default async function Read({ params }: { params: { link: string } }) {
  // const article = await ExtractArticle(decodeURIComponent(params.link));
  // const article = await ExtractArticle(
  //   "https://12ft.io/https://vercel.com/blog/preventing-infrastructure-abuse-with-vercel-firewall",
  // );
  // const article = await Parser.parse(decodeURIComponent(params.link));
  // console.log(article);
  // console.log(decodeURIComponent(params.link));
  let article;
  const dom = await JSDOM.fromURL(decodeURIComponent(params.link));

  if (isProbablyReaderable(dom.window.document)) {
    const reader = new Readability(dom.window.document);
    article = reader.parse();
    console.log(article);
  } else {
    article = null;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-28">
      <RouteBack text="Back" />
      <h1 className="text-3xl font-bold">{article?.title}</h1>
      <Article content={article?.content as string} />
    </main>
  );
}
