"use client";

import dynamic from "next/dynamic";

export const ClientArticle = dynamic(() => import("./article"), {
  ssr: false,
  loading: () => <ArticleFallback />,
});

function ArticleFallback() {
  return (
    <div className="flex flex-col animate-pulse space-y-6 px-4">
      <div className="h-14 w-48 flex items-center">
        <div className="rounded bg-ui-normal h-10 w-full"></div>
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
