"use client";

import dynamic from "next/dynamic";

export const ClientArticle = dynamic(() => import("./article"), {
  ssr: false,
  loading: () => <ArticleFallback />,
});

function ArticleFallback() {
  return (
    <div className="flex animate-pulse flex-col space-y-6 px-4">
      <div className="flex h-10 w-72 items-center">
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
