import { Suspense } from "react";

import ArticleContent from "./components/article-content";

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
