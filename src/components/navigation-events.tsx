"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { deleteCookie } from "cookies-next/client";
import { useErrorBoundary } from "react-error-boundary";

import { useArticleContent } from "@/store/article-content";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { resetBoundary } = useErrorBoundary();

  const { setArticleData, articleContent } = useArticleContent();

  useEffect(() => {
    // reset article data on route change
    // deleteCookie("feedUrl");
    // deleteCookie("articleId");
    // if (!pathname.startsWith("/read")) {
    //   setArticleData("", "", false);
    // }
    resetBoundary();
  }, [pathname, searchParams]);

  return null;
}
