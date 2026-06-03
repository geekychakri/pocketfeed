import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import ArticleContent from "./components/article-content";

export default function Read({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const linkParamsPromise = searchParams.then((pa) => ({ link: pa.link }));

  return (
    <div className="mx-auto min-h-screen w-full max-w-[65ch] pb-14 shadow-[0px_0px_10px_1px_var(--border-non-interactive)]">
      <ErrorBoundary
        fallback={<div className="text-danger p-4">Something went wrong!</div>}
      >
        <Suspense fallback={<ArticleFallback />}>
          <ArticleContentWrapper linkParamsPromise={linkParamsPromise} />
        </Suspense>
      </ErrorBoundary>
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
    <div className="flex animate-pulse flex-col px-4">
      <div className="flex h-14 w-full items-center justify-between">
        <div className="bg-ui-normal h-11 w-48 rounded"></div>
        <div className="flex items-center gap-4">
          <div className="bg-ui-normal size-6 rounded"></div>
          <div className="bg-ui-normal size-6 rounded"></div>
          <div className="bg-ui-normal size-6 rounded"></div>
        </div>
      </div>
      <div className="h-14 w-full animate-none! bg-transparent"></div>
      <div className="mb-6 flex h-14 w-72 items-center">
        <div className="bg-ui-normal h-full w-full rounded"></div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
        <div className="bg-ui-normal h-8 rounded"></div>
      </div>
    </div>
  );
}
