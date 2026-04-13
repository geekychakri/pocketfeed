import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCookie } from "cookies-next/client";

import HighlightToolbar from "./highlight-toolbar";

export default function ArticleText({
  contentToRead,
}: {
  contentToRead: string;
}) {
  // const hltrRef = useRef();
  const articleRef = useRef<HTMLDivElement | null>(null);

  const articleId = getCookie("articleId") as string;

  // text highlight
  // const [highlights, setHighlights] = useState([]);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [position, setPosition] = useState<Record<string, number>>();

  // const handleMouseUp = () => {
  //   const selection = window.getSelection();
  //   if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
  //     const range = selection.getRangeAt(0);
  //     const text = range.toString().trim();

  //     if (!text) {
  //       setCurrentSelection(undefined);
  //       return;
  //     }

  //     // console.log("Mouse up - Selection detected:", text);
  //     setCurrentSelection(text);
  //     const rect = selection.getRangeAt(0).getBoundingClientRect();

  //     setPosition({
  //       // 80 represents the width of the share button, this may differ for you
  //       x: rect.left + rect.width / 2 - 220 / 2,
  //       // 30 represents the height of the share button, this may differ for you
  //       y: rect.top + window.scrollY - 44,
  //       width: rect.width,
  //       height: rect.height,
  //     });
  //   }
  // };

  const lastRangeRef = useRef<Range | null>(null);

  // const handleMouseUp = () => {
  //   const selection = window.getSelection();

  //   if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
  //     setCurrentSelection(undefined);
  //     lastRangeRef.current = null;
  //     return;
  //   }

  //   const range = selection.getRangeAt(0);
  //   const text = range.toString().trim();

  //   if (!text) {
  //     setCurrentSelection(undefined);
  //     lastRangeRef.current = null;
  //     return;
  //   }

  //   // detect same range click
  //   if (
  //     lastRangeRef.current &&
  //     range.compareBoundaryPoints(
  //       Range.START_TO_START,
  //       lastRangeRef.current,
  //     ) === 0 &&
  //     range.compareBoundaryPoints(Range.END_TO_END, lastRangeRef.current) === 0
  //   ) {
  //     // same selection → close
  //     setCurrentSelection(undefined);
  //     lastRangeRef.current = null;
  //     selection.removeAllRanges();
  //     return;
  //   }

  //   lastRangeRef.current = range.cloneRange();

  //   const rect = range.getBoundingClientRect();

  //   setCurrentSelection(text);

  //   setPosition({
  //     x: rect.left + rect.width / 2 - 220 / 2,
  //     y: rect.top + window.scrollY - 44,
  //     width: rect.width,
  //     height: rect.height,
  //   });
  // };

  const MIN_SHARE_LENGTH = 20;

  const handleMouseUp = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setCurrentSelection(undefined);
      return;
    }

    const range = selection.getRangeAt(0);
    const text = range.toString().trim();

    // only allow popup if text length passes threshold
    if (text.length < MIN_SHARE_LENGTH) {
      setCurrentSelection(undefined);
      return;
    }

    const rect = range.getBoundingClientRect();

    setCurrentSelection(text);

    setPosition({
      x: rect.left + rect.width / 2 - 220 / 2,
      y: rect.top + window.scrollY - 44,
      width: rect.width,
      height: rect.height,
    });
  };

  function onSelectStart() {
    setCurrentSelection(undefined);
  }

  // console.log({ currentSelection });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setCurrentSelection(undefined);
        return;
      }

      const range = selection.getRangeAt(0);
      const text = range.toString().trim();

      if (text.length < MIN_SHARE_LENGTH) {
        setCurrentSelection(undefined);
        return;
      }

      const rect = range.getBoundingClientRect();

      setCurrentSelection(text);

      setPosition({
        x: rect.left + rect.width / 2 - 220 / 2,
        y: rect.top + window.scrollY - 44,
        width: rect.width,
        height: rect.height,
      });
    };
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const memoizedHTML = useMemo(
    () => ({ __html: contentToRead }),
    [contentToRead],
  );
  return (
    <div
      className="prose
      [&_svg]:w-full
      [&_svg]:h-auto
      [&_svg]:max-w-full prose-a:text-brand-primary prose-a:[text-decoration-skip-ink:none] prose-pre:rounded-xl prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary px-4"
    >
      {currentSelection && position && (
        <HighlightToolbar
          position={position}
          // handleHighlight={handleHighlight}

          handleCopy={async () => {
            try {
              await navigator.clipboard.writeText(currentSelection);
              setCurrentSelection(undefined);
              window.getSelection()?.empty();
              console.log("Text copied");
            } catch (err) {
              console.error("Failed to copy:", err);
            }
          }}
        />
      )}
      <article ref={articleRef} dangerouslySetInnerHTML={memoizedHTML} />
    </div>
  );
}
