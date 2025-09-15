"use client";

import dynamic from "next/dynamic";

export const ClientArticle = dynamic(() => import("@/components/Article"), {
  ssr: false,
  loading: () => "Loading...",
});
