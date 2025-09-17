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
    if (!pathname.startsWith("/read")) {
      setArticleData("", "", false);
    }
  }, [pathname, searchParams]);

  return null;
}
