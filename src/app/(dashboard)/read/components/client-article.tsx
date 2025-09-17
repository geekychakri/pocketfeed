"use client";

import dynamic from "next/dynamic";

export const ClientArticle = dynamic(() => import("./article"), {
  ssr: false,
  loading: () => "Loading...",
});
