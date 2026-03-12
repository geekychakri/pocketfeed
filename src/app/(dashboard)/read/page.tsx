import { Suspense } from "react";
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

import ArticleContent from "./components/article-content";
import { ClientArticle } from "./components/client-article";
import Notebook from "./components/notebook";
import ReadNav from "./components/read-nav";
import ToggleMenu from "./components/toggle-menu";

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

type PageProps = {
  params: Promise<{ link: string }>;
};
export default function Read({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const linkParamsPromise = searchParams.then((pa) => ({ link: pa.link }));
  // const userId = (await auth()).userId as string;

  return (
    <div className="w-full max-w-[65ch] pb-14 shadow-[0px_0px_10px_1px_var(--border-non-interactive)]  min-h-screen mx-auto">
      {/*<ToggleMenu />*/}

      {/* <div className="w-full max-w-[60ch] pb-14 border-x min-h-screen grid grid-cols-[1fr_65ch_1fr]">
        <ReadNav
          // articleSiteName={article?.siteName}
          articleUrl={articleUrl}

          // bookmarkExists={bookmarkItem?.isBookmarkExists}
          // bookmarkId={bookmarkItem?.id}
        />
        <div>
          <div className="h-14"></div>
          <ClientArticle articleUrl={articleUrl} />
        </div>
      </div> */}

      <Suspense fallback={<ArticleFallback />}>
        <ArticleContentWrapper linkParamsPromise={linkParamsPromise} />
      </Suspense>
      {/*<Notebook />*/}
    </div>
  );
}

async function ArticleContentWrapper({
  linkParamsPromise,
}: {
  linkParamsPromise: any;
}) {
  const { link: articleUrl } = await linkParamsPromise;
  return <ArticleContent articleUrl={articleUrl} />;
}

function ArticleFallback() {
  return (
    <div className="flex flex-col animate-pulse space-y-6 px-4">
      <div className="h-14 w-48 flex items-center">
        <div className="rounded bg-ui-normal h-7 w-full"></div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
      </div>
    </div>
  );
}
