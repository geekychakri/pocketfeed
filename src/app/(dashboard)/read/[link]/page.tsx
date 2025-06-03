import { ExtractArticle } from "@/lib/extract-article";
import Article from "@/components/Article";

// import Parser from "@postlight/parser";
import RouteBack from "@/components/RouteBack/RouteBack";

import localFont from "next/font/local";

import Script from "next/script";

import { JSDOM } from "jsdom";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import ArticleSettings from "@/components/ArticleSettings";

import { checkLinkIsBroken } from "@/lib/utils";
import { LinkBrokenIcon } from "@/icons/link-broken";
import { GlobeErrorIcon } from "@/icons/globe-error";
import { GlobalIcon } from "@/icons/globe";
import { BookmarkIcon } from "@/icons/bookmark";
import { FullScreenCircleIcon } from "@/icons/full-screen";
import ReadNav from "../components/read-nav";

import { getXataClient } from "@/xata";

import { auth } from "@clerk/nextjs/server";

async function checkBookmarkExists(
  filterCondition: Record<string, any>,
): Promise<{
  type: string;
  id: string | null;
  isBookmarkExists: boolean | null;
}> {
  try {
    const xata = getXataClient();
    // Fetch the first record that matches the filter condition
    const record = await xata.db.bookmarks.filter(filterCondition).getFirst();

    // Return true if a record is found, false otherwise
    return {
      type: "success",
      id: record?.id as string,
      isBookmarkExists: record !== null,
    };
  } catch (error) {
    console.error("Error checking item existence:", error);
    return { type: "error", id: null, isBookmarkExists: null };
  }
}

export default async function Read(props: {
  params: Promise<{ link: string }>;
}) {
  const params = await props.params;
  const userId = (await auth()).userId as string;
  let article, articleUrl;

  let bookmarkItem!: {
    type: string;
    id: string | null;
    isBookmarkExists: boolean | null;
  };

  try {
    articleUrl = decodeURIComponent(params.link);
    console.log({ articleUrl });

    const { error } = await checkLinkIsBroken(articleUrl);

    if (error) {
      return (
        <div className="flex h-screen flex-1 flex-col items-center justify-center gap-6">
          <LinkBrokenIcon className="size-20" />
          <div className="flex flex-col items-center gap-2">
            <span>Oops!</span>
            <span>
              The link{" "}
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-underline"
              >
                {articleUrl}
              </a>{" "}
              seems broken.
            </span>
          </div>
          <RouteBack text="Back" />
        </div>
      );
    }

    const dom = await JSDOM.fromURL(articleUrl);

    if (isProbablyReaderable(dom.window.document)) {
      // const xata = getXataClient();
      // const isBookmarked = await xata.db.bookmarks
      //   .filter({
      //     userId,
      //     bookmarkLink: decodeURIComponent(params.link),
      //   })
      //   .getFirst();
      // console.log({ isBookmarked });
      bookmarkItem = await checkBookmarkExists({
        userId,
        bookmarkLink: decodeURIComponent(params.link),
      });
      const reader = new Readability(dom.window.document);

      article = reader.parse();
      console.log(article);
    } else {
      article = null;
    }
  } catch (err) {
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
      {/* <ArticleSettings /> */}
      {/* <nav className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border-non-interactive bg-background-primary px-4">
        <p className="text-text-secondary">{article?.siteName}</p>
        <div className="flex items-center gap-5">
          <div>
            <FullScreenCircleIcon />
          </div>
          <div>
            <BookmarkIcon className="size-4" />
          </div>
          <a href={articleUrl} target="_blank" rel="noopener noreferrer">
            <GlobalIcon />
          </a>
        </div>
      </nav> */}

      <ReadNav
        articleSiteName={article?.siteName}
        articleUrl={articleUrl}
        articleTitle={article?.title as string}
        bookmarkExists={bookmarkItem?.isBookmarkExists}
        bookmarkId={bookmarkItem?.id}
      />

      {/* <div className="relative mx-auto mt-7 flex w-full max-w-3xl flex-col">
        <div className="relative flex items-center">
          <RouteBack className="absolute -left-9 p-2" />
          <h1 className="flex h-14 items-center text-balance text-[20px] font-medium tracking-tight text-text-primary!">
            {article?.title}
          </h1>
        </div>
        <Article content={article?.content as string} />
      </div> */}
      <div className="mx-auto w-full max-w-[60ch] px-4 pt-7 pb-14">
        <div className="relative flex items-center">
          {/* <RouteBack className="absolute -left-9 p-2" /> */}
          <h1 className="text-text-primary! flex h-14 items-center text-xl font-medium tracking-tight text-balance">
            {article?.title}
          </h1>
        </div>
        <Article
          content={article?.content as string}
          articleSiteName={article?.siteName as string}
          articleUrl={articleUrl}
        />
      </div>
    </main>
  );
}
