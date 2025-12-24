import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

import { getCookie } from "cookies-next/client";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { nanoid } from "nanoid";
import useSWR from "swr";

import { saveHighlight } from "@/app/actions/save-highlight";
import { fetcher } from "@/lib/utils";
import { useArticleHighlights } from "@/store/article-highlights";
import { useHighlighterRef } from "@/store/highlighterRef";
import { useToggleNotebook } from "@/store/toggle-notebook";
import useStore from "@/store/useStore";

import HighlightToolbar from "./highlight-toolbar";

export default function ArticleText({
  contentToRead,
}: {
  contentToRead: string;
}) {
  const { setHighlights } = useArticleHighlights();
  const { hltrRef } = useHighlighterRef();
  // const hltrRef = useRef();
  const articleRef = useRef<HTMLDivElement | null>(null);

  const articleId = getCookie("articleId") as string;

  // text highlight
  // const [highlights, setHighlights] = useState([]);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [position, setPosition] = useState<Record<string, number>>();

  // const { data, error, isLoading } = useSWR(
  //   `/api/getHighlights?articleId=${articleId}`,
  //   fetcher,
  //   {
  //     // keepPreviousData: true,
  //     // revalidateIfStale: true,
  //     // revalidateOnMount: true,
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //     onError: (error, key) => {
  //       // if (error.status === 500) {
  //       //   internalErrorToast(INTERNAL_ERROR_MESSAGE);
  //       // }
  //     },
  //     onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  //       // Never retry on 404.
  //       if (error.status === 500) return;

  //       // Only retry up to 5 times.
  //       if (retryCount >= 5) return;
  //     },
  //   },
  // );

  // const addHighlight = useCallback(
  //   (
  //     highlightId: string,
  //     highlightData: {
  //       element: HTMLElement;
  //       selection: TextSelection;
  //       temporary?: boolean;
  //     },
  //   ) => {
  //     setHighlights((prev) => {
  //       const newHighlights = new Map(prev);
  //       newHighlights.set(highlightId, highlightData);
  //       return newHighlights;
  //     });
  //   },
  //   [],
  // );

  // const handleHighlight = async () => {
  //   if (articleRef.current) {
  //     const ranges = findTextInElement(
  //       articleRef.current as HTMLElement,
  //       currentSelection.trim(),
  //     );
  //     // console.log({ ranges });
  //     ranges.forEach((range) => {
  //       const highlight = highlightRange(range, "span", {
  //         className:
  //           "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
  //       });
  //       highlight.setAttribute("data-manual-highlight", nanoid());
  //       highlight.id = nanoid();
  //     });
  //     // setHighlightCount((prev) => prev + ranges.length);
  //     setCurrentSelection(undefined);
  //     await saveHighlight({ articleId, highlightText: currentSelection });
  //   }
  // };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const text = range.toString().trim();

      if (!selection && !text) {
        setCurrentSelection(undefined);
        return;
      }

      // console.log("Mouse up - Selection detected:", text);
      setCurrentSelection(text);
      const rect = selection.getRangeAt(0).getBoundingClientRect();

      setPosition({
        // 80 represents the width of the share button, this may differ for you
        x: rect.left + rect.width / 2 - 220 / 2,
        // 30 represents the height of the share button, this may differ for you
        y: rect.top + window.scrollY - 44,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  function onSelectStart() {
    setCurrentSelection(undefined);
  }

  // console.log({ currentSelection });

  useEffect(() => {
    document.addEventListener("selectstart", onSelectStart);
    window.addEventListener("mouseup", handleMouseUp, true);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);
      window.removeEventListener("mouseup", handleMouseUp, true);
    };
  }, []);
  // text highlight

  // useEffect(() => {
  //   if (!articleRef.current || data.highlights.length === 0) return;

  //   const processedContent = new Set<string>();

  //   data.highlights.forEach((content) => {
  //     const contentKey = `${content.text}-${content.startOffset}-${content.endOffset}`;
  //     if (processedContent.has(contentKey)) return;

  //     processedContent.add(contentKey);

  //     const ranges = findTextInElement(articleRef.current!, content.text);
  //     ranges.forEach((range) => {
  //       if (
  //         // isRangeAlreadyHighlighted(range, highlights) ||
  //         // isRangeAlreadyHighlighted(range, customHighlights) ||
  //         isRangeWithinHighlight(range, articleRef.current!)
  //       ) {
  //         return;
  //       }

  //       const selection: TextSelection = {
  //         text: content.text,
  //         range: range.cloneRange(),
  //         position: {
  //           x: range.getBoundingClientRect().left + window.scrollX,
  //           y: range.getBoundingClientRect().top + window.scrollY,
  //         },
  //         boundingRect: range.getBoundingClientRect(),
  //       };

  //       const highlightElementNode = highlightRange(range, "span", {
  //         className:
  //           "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
  //       });
  //       const highlightId = `preselected-${Date.now()}-${Math.random()}`;
  //       highlightElementNode.setAttribute("data-highlight-id", highlightId);

  //       addHighlight(highlightId, {
  //         element: highlightElementNode,
  //         selection,
  //       });
  //     });
  //   });
  // }, [addHighlight, data]);

  // if (isLoading) {
  //   return "Loading highlights!";
  // }

  // console.log({ data });
  const memoizedHTML = useMemo(
    () => ({ __html: contentToRead }),
    [contentToRead],
  );
  return (
    <div className="prose prose-a:no-underline prose-pre:rounded-xl prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary px-4">
      {currentSelection && position && (
        <HighlightToolbar
          position={position}
          // handleHighlight={handleHighlight}
          handleNote={() => {
            // setCurrentSelection(undefined);
          }}
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

      {/* {parse(
        DOMPurify.sanitize(contentToRead, {
          FORBID_TAGS: ["style"],
          FORBID_ATTR: ["style"],
        }),
      )} */}
      <Script
        src="/scripts/text-highlighter.js"
        onReady={() => {
          hltrRef.current = new TextHighlighter(articleRef.current, {
            onBeforeHighlight: function (range) {
              console.log({ range: range.getBoundingClientRect().width });

              return true;
            },
            onAfterHighlight: function (range, highlights) {
              const getSerializedHighlights = JSON.parse(
                hltrRef.current.serializeHighlights(),
              );

              console.log({ getSerializedHighlights });

              const unique = Array.from(
                new Set(
                  getSerializedHighlights.map((item) => JSON.stringify(item)),
                ),
              ).map((str) => JSON.parse(str));
              setHighlights([...unique]);
            },
          });

          // hltrRef.current.deserializeHighlights(savedHlts); //TODO: highlight on mount
        }}
      />
    </div>
  );
}
