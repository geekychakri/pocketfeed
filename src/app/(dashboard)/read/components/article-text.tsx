import { useMemo, useRef, useState } from "react";

import HighlightToolbar from "./highlight-toolbar";

export default function ArticleText({
  contentToRead,
}: {
  contentToRead: string;
}) {
  const articleRef = useRef<HTMLDivElement | null>(null);

  const memoizedHTML = useMemo(
    () => ({ __html: contentToRead }),
    [contentToRead],
  );
  return (
    <div className="prose prose-a:text-brand-primary prose-a:[text-decoration-skip-ink:none] prose-pre:rounded-xl prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary px-4 [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full">
      <HighlightToolbar />
      <article ref={articleRef} dangerouslySetInnerHTML={memoizedHTML} />
    </div>
  );
}
