"use client";

import { ClientArticle } from "./client-article";
import ReadNav from "./read-nav";

// const ReadNav = dynamic(() => import("./read-nav"), {
//   ssr: false,
// });

export default function ArticleContent({ articleUrl }: { articleUrl: string }) {
  // console.log({ articleUrl });
  return (
    <div
      // className={`${isNotebookOpen ? "flex-1" : "w-full max-w-[60ch]"} pb-14 border-x min-h-screen`}
      className="min-h-screen pb-14"
    >
      <ReadNav
        key={articleUrl}
        // articleSiteName={article?.siteName}
        articleUrl={articleUrl}
        // getReadList={getReadList}

        // bookmarkExists={bookmarkItem?.isBookmarkExists}
        // bookmarkId={bookmarkItem?.id}
      />
      <div>
        <div className="h-14"></div>
        <ClientArticle articleUrl={articleUrl} />
      </div>
    </div>
  );
}
