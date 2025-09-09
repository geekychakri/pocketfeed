"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useArticleContent } from "@/store/article-content";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setArticleData, articleContent } = useArticleContent();

  useEffect(() => {
    // reset article data on route change
    if (articleContent?.length >= 1 && !pathname.startsWith("/read")) {
      setArticleData("", "");
    }
  }, [pathname, searchParams]);

  return null;
}
