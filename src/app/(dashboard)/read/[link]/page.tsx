import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Script from "next/script";

import { auth } from "@clerk/nextjs/server";
import { extract } from "@extractus/article-extractor";
import { isProbablyReaderable, Readability } from "@mozilla/readability";
import nord from "@shikijs/themes/nord";
import { JSDOM, VirtualConsole } from "jsdom";
import { createHighlighter } from "shiki";

import ArticleSettings from "@/components/article-settings";
import InlineScript from "@/components/inline-script";
// import Parser from "@postlight/parser";
import RouteBack from "@/components/route-back";

import { BookmarkIcon } from "@/icons/bookmark";
import { FullScreenCircleIcon } from "@/icons/full-screen";
import { GlobalIcon } from "@/icons/globe";
import { GlobeErrorIcon } from "@/icons/globe-error";
import { LinkBrokenIcon } from "@/icons/link-broken";
import { ExtractArticle } from "@/lib/extract-article";
import { checkLinkIsBroken } from "@/lib/utils";
import { getXataClient } from "@/xata";

import { ClientArticle } from "../components/client-article";
import ReadNav from "../components/read-nav";

// async function checkBookmarkExists(
//   filterCondition: Record<string, any>,
// ): Promise<{
//   type: string;
//   id: string | null;
//   isBookmarkExists: boolean | null;
// }> {
//   try {
//     const xata = getXataClient();
//     // Fetch the first record that matches the filter condition
//     const record = await xata.db.bookmarks.filter(filterCondition).getFirst();

//     // Return true if a record is found, false otherwise
//     return {
//       type: "success",
//       id: record?.id as string,
//       isBookmarkExists: record !== null,
//     };
//   } catch (error) {
//     console.error("Error checking item existence:", error);
//     return { type: "error", id: null, isBookmarkExists: null };
//   }
// }

export default async function Read(props: {
  params: Promise<{ link: string }>;
}) {
  const params = await props.params;
  const userId = (await auth()).userId as string;

  let article, articleUrl;

  try {
    console.log("article");
    articleUrl = params.link;
  } catch (err) {
    console.log(err);

    return (
      <div className="flex h-screen flex-1 flex-col items-center justify-center gap-6">
        <GlobeErrorIcon className="size-20" />
        <span>Something went wrong! Please try again later.</span>
        <RouteBack text="Back" />
      </div>
    );
  }

  return (
    <main className="w-full flex-1">
      <ReadNav
        // articleSiteName={article?.siteName}
        articleUrl={articleUrl}

        // bookmarkExists={bookmarkItem?.isBookmarkExists}
        // bookmarkId={bookmarkItem?.id}
      />

      <div className="mx-auto w-full max-w-[60ch] px-4 pb-14">
        <div className="h-14"></div>
        <ClientArticle articleUrl={articleUrl} />
      </div>
    </main>
  );
}
