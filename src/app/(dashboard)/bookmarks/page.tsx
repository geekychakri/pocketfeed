import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";

import RouteBack from "@/components/route-back";

import { getBookmarks } from "@/db/queries";

import BookmarkList from "./components/bookmark-list";

export default async function BookmarksPage() {
  return (
    <div className="mx-auto w-full max-w-[750px] py-20 border-x min-h-screen shadow-[0_0px_10px_1px_var(--border-non-interactive)]">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-lg font-medium px-4">Bookmarks</h1>
      </div>
      {/* <BookmarksStoreProvider initialData={page.records.toSerializable()}> */}

      <ErrorBoundary
        fallback={
          <div className="px-4 text-danger">
            Something went wrong! Please try again later.
          </div>
        }
      >
        <Suspense fallback={<BookmarksFallback />}>
          <BookmarkList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function BookmarksFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-5 px-4 mt-5">
      {Array.from({ length: 10 }, (_, i) => {
        return <div key={i} className="rounded bg-ui-normal h-8"></div>;
      })}
    </div>
  );
}
