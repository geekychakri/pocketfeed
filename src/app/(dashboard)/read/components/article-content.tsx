"use client";

import { ClientArticle } from "./client-article";
import ReadNav from "./read-nav";

export default function ArticleContent({ articleUrl }: { articleUrl: string }) {
  return (
    <div
      // className={`${isNotebookOpen ? "flex-1" : "w-full max-w-[60ch]"} pb-14 border-x min-h-screen`}
      className="pb-14 border-x min-h-screen"
    >
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
    </div>
  );
}
