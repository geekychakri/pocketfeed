"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

import parse from "html-react-parser";
import {
  clearSelection,
  // findTextInElement,
  highlightRange,
  isRangeAlreadyHighlighted,
  isRangeWithinHighlight,
  isValidSelection,
  removeHighlight,
} from "lisere";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";
import { toast, Toaster } from "sonner";

// import {
//   getCurrentTextSelection,
//   highlightRange,
//   TextHighlighter,
//   useTextHighlighter,
// } from "lisere";

export type SelectionBoundary = "cursor" | "word";

const html = `<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
deserunt eius nihil labore voluptas nostrum hic ducimus soluta tempora,
porro neque. At, autem in. Libero explicabo voluptatibus officiis
aliquam obcaecati. Cumque voluptas temporibus repellat vitae ipsum est
accusantium tenetur fugit!
</p>
<h1>Article</h1>
<p>The API’s permission model might seem like extra overhead, but it’s a
worthwhile trade-off for security and reliability. Gone are the days of
wrestling with text selection and synchronous clipboard operations.</p>
`;

const selectedContent = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    startOffset: 0,
    endOffset: 19,
  },
  {
    text: "Gone are the days of wrestling with text selection and synchronous clipboard operations.",
    startOffset: 0,
    endOffset: 17,
  },
];

const normalize = (str) => str.replace(/\s+/g, " ").trim();

// const findTextInElement = (element, rawSearch) => {
//   const search = normalize(rawSearch);

//   const nodes = [];
//   const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

//   let node,
//     fullText = "",
//     map = [];

//   // Collect text nodes and build a mapping
//   while ((node = walker.nextNode())) {
//     const text = normalize(node.textContent || "");
//     const startIndex = fullText.length;

//     fullText += text;
//     map.push({
//       node,
//       start: startIndex,
//       end: startIndex + text.length,
//       text,
//     });
//   }

//   // Find match in normalized full text
//   const matchIndex = fullText.indexOf(search);
//   if (matchIndex === -1) return [];

//   const matchEnd = matchIndex + search.length;

//   // Convert match range → DOM Ranges
//   const domRanges = [];
//   let remainingStart = matchIndex;
//   let remainingEnd = matchEnd;

//   for (const { node, start, end } of map) {
//     const nodeStartInMatch = Math.max(remainingStart, start);
//     const nodeEndInMatch = Math.min(remainingEnd, end);

//     if (nodeStartInMatch < nodeEndInMatch) {
//       const r = document.createRange();
//       r.setStart(node, nodeStartInMatch - start);
//       r.setEnd(node, nodeEndInMatch - start);
//       domRanges.push(r);
//     }
//   }

//   console.log({ domRanges });
//   return domRanges;
// };

const findTextInElement = (element: HTMLElement, text: string): Range[] => {
  const normalizedText = normalize(text);
  const ranges: Range[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textContent = normalize(node.textContent || "");
    let index = 0;

    while ((index = textContent.indexOf(normalizedText, index)) !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + normalizedText.length);
      ranges.push(range);
      index += normalizedText.length;
    }
  }

  return ranges;
};
export interface TextSelection {
  /** The selected text content */
  text: string;
  /** The DOM range object representing the selection */
  range: Range;
  /** Absolute position coordinates of the selection */
  position: {
    x: number;
    y: number;
  };
  /** Bounding rectangle of the selection */
  boundingRect: DOMRect;
}

export default function Page() {
  const [toolbarPos, setToolbarPos] = useState(null); // {x, y}
  const [showToolbar, setShowToolbar] = useState(false);

  const hltrRef = useRef();
  const serializedHighlights = useRef();
  const articleRef = useRef();

  const containerRef = useRef<HTMLDivElement>(null);

  const [highlights, setHighlights] = useState<
    Map<
      string,
      { element: HTMLElement; selection: TextSelection; temporary?: boolean }
    >
  >(new Map());
  const [highlightCount, setHighlightCount] = useState(0);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [position, setPosition] = useState<Record<string, number>>();

  const [savedSelections, setSavedSelectionions] = useState();
  const [restoreSelections, setRestoreSelections] = useState();

  const addHighlight = useCallback(
    (
      highlightId: string,
      highlightData: {
        element: HTMLElement;
        selection: TextSelection;
        temporary?: boolean;
      },
    ) => {
      setHighlights((prev) => {
        const newHighlights = new Map(prev);
        newHighlights.set(highlightId, highlightData);
        return newHighlights;
      });
    },
    [],
  );

  console.log({ highlights });

  const handleGetSelection = () => {
    try {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString().trim();

        if (!selection && !text) {
          setCurrentSelection(undefined);
          return;
        }

        if (text) {
          setCurrentSelection(text);
          const rect = selection.getRangeAt(0).getBoundingClientRect();

          setPosition({
            // 80 represents the width of the share button, this may differ for you
            x: rect.left + rect.width / 2 - 80 / 2,
            // 30 represents the height of the share button, this may differ for you
            y: rect.top + window.scrollY - 30,
            width: rect.width,
            height: rect.height,
          });
        }
      } else {
        // if (selection?.isCollapsed) {
        //   setCurrentSelection("No text selected (click and drag to select)");
        // } else {
        //   setCurrentSelection("No selection");
        // }
      }
    } catch (error) {
      console.error("Error getting selection:", error);
      setCurrentSelection("Error getting selection");
    }
  };

  const handleHighlightOnParse = (text: string) => {
    if (containerRef.current) {
      const ranges = findTextInElement(
        containerRef.current as HTMLElement,
        text.trim(),
      );
      // console.log({ ranges });
      ranges.forEach((range) => {
        const highlight = highlightRange(range, "span", {
          className:
            "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
        });
        highlight.setAttribute("data-manual-highlight", nanoid());
        highlight.id = nanoid();
      });
    }
  };
  const handleHighlight = () => {
    if (containerRef.current) {
      const ranges = findTextInElement(
        containerRef.current as HTMLElement,
        currentSelection.trim(),
      );
      // console.log({ ranges });
      ranges.forEach((range) => {
        const highlight = highlightRange(range, "span", {
          className:
            "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
        });
        highlight.setAttribute("data-manual-highlight", nanoid());
        highlight.id = nanoid();
      });
      setHighlightCount((prev) => prev + ranges.length);
      setCurrentSelection(undefined);
    }
  };

  // console.log({ currentSelection });
  // console.log({ highlightCount });

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
        x: rect.left + rect.width / 2 - 80 / 2,
        // 30 represents the height of the share button, this may differ for you
        y: rect.top + window.scrollY - 30,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  function onSelectStart() {
    setCurrentSelection(undefined);
  }

  useEffect(() => {
    document.addEventListener("selectstart", onSelectStart);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // console.log({ currentSelection });

  // useEffect(() => {
  //   if (!containerRef.current || selectedContent.length === 0) return;

  //   const processedContent = new Set<string>();

  //   selectedContent.forEach((content) => {
  //     console.log({ content });
  //     const contentKey = `${content.text}-${content.startOffset}-${content.endOffset}`;
  //     if (processedContent.has(contentKey)) return;

  //     processedContent.add(contentKey);

  //     const ranges = findTextInElement(containerRef.current!, content.text);
  //     console.log({ ranges });
  //     ranges.forEach((range) => {
  //       if (
  //         // isRangeAlreadyHighlighted(range, highlights) ||
  //         // isRangeAlreadyHighlighted(range, customHighlights) ||
  //         isRangeWithinHighlight(range, containerRef.current!)
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
  // }, [addHighlight]);
  // console.log({ highlights });

  console.log({ currentSelection });

  //Selection boundary by word

  const getCurrentTextSelection = (): TextSelection | null => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (!selectedText) {
      return null;
    }

    const boundingRect = range.getBoundingClientRect();

    // //custom code
    //     setCurrentSelection(selectedText);
    //     const rect = selection.getRangeAt(0).getBoundingClientRect();

    //     setPosition({
    //       // 80 represents the width of the share button, this may differ for you
    //       x: rect.left + rect.width / 2 - 80 / 2,
    //       // 30 represents the height of the share button, this may differ for you
    //       y: rect.top + window.scrollY - 30,
    //       width: rect.width,
    //       height: rect.height,
    //     });
    // //custom code

    return {
      text: selectedText,
      range: range.cloneRange(),
      position: {
        x: boundingRect.left + window.scrollX,
        y: boundingRect.top + window.scrollY,
      },
      boundingRect,
    };
  };

  const adjustRangeToWordBoundaries = (range: Range): Range => {
    const newRange = range.cloneRange();

    if (range.collapsed) {
      return newRange;
    }

    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textBefore = (startContainer.textContent || "").slice(
        0,
        startOffset,
      );
      const lastSpaceIndex = textBefore.lastIndexOf(" ");
      if (lastSpaceIndex !== -1) {
        startOffset = lastSpaceIndex + 1;
      } else {
        startOffset = 0;
      }
    }

    if (endContainer.nodeType === Node.TEXT_NODE) {
      const textAfter = (endContainer.textContent || "").slice(endOffset);
      const firstSpaceIndex = textAfter.indexOf(" ");
      if (firstSpaceIndex !== -1) {
        endOffset += firstSpaceIndex;
      } else {
        endOffset = (endContainer.textContent || "").length;
      }
    }

    newRange.setStart(startContainer, startOffset);
    newRange.setEnd(endContainer, endOffset);

    return newRange;
  };
  const getAdjustedSelection = (
    selectionBoundary: SelectionBoundary = "word",
  ) => {
    const selection = getCurrentTextSelection();
    if (!selection) return null;

    if (selectionBoundary === "cursor") {
      return selection;
    }

    const adjustedRange = adjustRangeToWordBoundaries(selection.range);
    const adjustedText = adjustedRange.toString().trim();

    if (!adjustedText) return null;

    const boundingRect = adjustedRange.getBoundingClientRect();

    //custom code

    if (containerRef.current) {
      const ranges = findTextInElement(
        containerRef.current as HTMLElement,
        adjustedText,
      );
      // console.log({ ranges });
      ranges.forEach((range) => {
        const highlight = highlightRange(range, "span", {
          className:
            "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
        });
        highlight.setAttribute("data-manual-highlight", nanoid());
        highlight.id = nanoid();
      });
      setHighlightCount((prev) => prev + ranges.length);
      setCurrentSelection(undefined);
    }
    //custom code

    // return {
    //   text: adjustedText,
    //   range: adjustedRange,
    //   position: {
    //     x: boundingRect.left + window.scrollX,
    //     y: boundingRect.top + window.scrollY,
    //   },
    //   boundingRect,
    // }
  };

  //Selection boundary by word

  //Tim down solution
  function modifySelection() {
    // Source - https://stackoverflow.com/a
    // Posted by Tim Down, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-11-21, License - CC BY-SA 3.0

    var sel;

    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
      sel = window.getSelection();
      if (!sel.isCollapsed) {
        // Detect if selection is backwards
        var range = document.createRange();
        range.setStart(sel.anchorNode, sel.anchorOffset);
        range.setEnd(sel.focusNode, sel.focusOffset);
        var backwards = range.collapsed;
        range.detach();

        // modify() works on the focus of the selection
        var endNode = sel.focusNode,
          endOffset = sel.focusOffset;
        sel.collapse(sel.anchorNode, sel.anchorOffset);

        var direction = [];
        if (backwards) {
          direction = ["backward", "forward"];
        } else {
          direction = ["forward", "backward"];
        }

        sel.modify("move", direction[0], "character");
        sel.modify("move", direction[1], "word");
        sel.extend(endNode, endOffset);
        sel.modify("extend", direction[1], "character");
        sel.modify("extend", direction[0], "word");
        console.log(window.getSelection().toString().trim());
        //custom
        if (containerRef.current) {
          const ranges = findTextInElement(
            containerRef.current as HTMLElement,
            window.getSelection().toString().trim(),
          );
          // console.log({ ranges });
          ranges.forEach((range) => {
            const highlight = highlightRange(range, "span", {
              className: "bg-yellow-300",
            });
            highlight.setAttribute("data-manual-highlight", nanoid());
            highlight.id = nanoid();
          });
          setHighlightCount((prev) => prev + ranges.length);
          setCurrentSelection(undefined);
        }
        //custom
      }
    } else if ((sel = document.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      if (textRange.text) {
        textRange.expand("word");
        // Move the end back to not include the word's trailing space(s),
        // if necessary
        while (/\s$/.test(textRange.text)) {
          textRange.moveEnd("character", -1);
        }
        textRange.select();
      }
    }
  }
  // Tim down solution

  //save and restore
  // Source - https://stackoverflow.com/a
  // Posted by Tim Down, modified by community. See post 'Timeline' for change history
  // Retrieved 2025-11-23, License - CC BY-SA 3.0

  // if (window.getSelection && document.createRange) {
  //     saveSelection = function(containerEl) {
  //         var range = window.getSelection().getRangeAt(0);
  //         var preSelectionRange = range.cloneRange();
  //         preSelectionRange.selectNodeContents(containerEl);
  //         preSelectionRange.setEnd(range.startContainer, range.startOffset);
  //         var start = preSelectionRange.toString().length;

  //         return {
  //             start: start,
  //             end: start + range.toString().length
  //         };
  //     };

  //     restoreSelection = function(containerEl, savedSel) {
  //         var charIndex = 0, range = document.createRange();
  //         range.setStart(containerEl, 0);
  //         range.collapse(true);
  //         var nodeStack = [containerEl], node, foundStart = false, stop = false;

  //         while (!stop && (node = nodeStack.pop())) {
  //             if (node.nodeType == 3) {
  //                 var nextCharIndex = charIndex + node.length;
  //                 if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
  //                     range.setStart(node, savedSel.start - charIndex);
  //                     foundStart = true;
  //                 }
  //                 if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
  //                     range.setEnd(node, savedSel.end - charIndex);
  //                     stop = true;
  //                 }
  //                 charIndex = nextCharIndex;
  //             } else {
  //                 var i = node.childNodes.length;
  //                 while (i--) {
  //                     nodeStack.push(node.childNodes[i]);
  //                 }
  //             }
  //         }

  //         var sel = window.getSelection();
  //         sel.removeAllRanges();
  //         sel.addRange(range);
  //     }
  // } else if (document.selection) {
  //     saveSelection = function(containerEl) {
  //         var selectedTextRange = document.selection.createRange();
  //         var preSelectionTextRange = document.body.createTextRange();
  //         preSelectionTextRange.moveToElementText(containerEl);
  //         preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
  //         var start = preSelectionTextRange.text.length;

  //         return {
  //             start: start,
  //             end: start + selectedTextRange.text.length
  //         }
  //     };

  //     restoreSelection = function(containerEl, savedSel) {
  //         var textRange = document.body.createTextRange();
  //         textRange.moveToElementText(containerEl);
  //         textRange.collapse(true);
  //         textRange.moveEnd("character", savedSel.end);
  //         textRange.moveStart("character", savedSel.start);
  //         textRange.select();
  //     };
  // }

  function saveSelection() {
    const containerEl = containerRef.current;
    var range = window.getSelection().getRangeAt(0);
    var preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    var start = preSelectionRange.toString().length;

    setSavedSelectionions({
      start: start,
      end: start + range.toString().length,
    });
    // return {
    //   start: start,
    //   end: start + range.toString().length,
    // };
  }

  function restoreSelection() {
    const containerEl = containerRef.current;
    // console.log({ containerEl });
    const savedSel = savedSelections;
    var charIndex = 0,
      range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    var nodeStack = [containerEl],
      node,
      foundStart = false,
      stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType == 3) {
        var nextCharIndex = charIndex + node.length;
        if (
          !foundStart &&
          savedSel.start >= charIndex &&
          savedSel.start <= nextCharIndex
        ) {
          range.setStart(node, savedSel.start - charIndex);
          foundStart = true;
        }
        if (
          foundStart &&
          savedSel.end >= charIndex &&
          savedSel.end <= nextCharIndex
        ) {
          range.setEnd(node, savedSel.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        var i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    var sel = window.getSelection();
    console.log({ sel });
    console.log({ selString: sel?.toString() });
    // sel.removeAllRanges();
    console.log({ range });
    sel.addRange(range);
  }

  //save and restore

  return (
    <>
      {/* <button
        onClick={() => {
          if (!containerRef.current || selectedContent.length === 0) return;

          const processedContent = new Set<string>();

          selectedContent.forEach((content) => {
            console.log({ content });
            const contentKey = `${content.text}-${content.startOffset}-${content.endOffset}`;
            if (processedContent.has(contentKey)) return;

            processedContent.add(contentKey);

            const ranges = findTextInElement(
              containerRef.current!,
              content.text.trim(),
            );
            console.log({ ranges });
            ranges.forEach((range) => {
              if (
                // isRangeAlreadyHighlighted(range, highlights) ||
                // isRangeAlreadyHighlighted(range, customHighlights) ||
                isRangeWithinHighlight(range, containerRef.current!)
              ) {
                return;
              }

              const selection: TextSelection = {
                text: content.text,
                range: range.cloneRange(),
                position: {
                  x: range.getBoundingClientRect().left + window.scrollX,
                  y: range.getBoundingClientRect().top + window.scrollY,
                },
                boundingRect: range.getBoundingClientRect(),
              };

              const highlightElementNode = highlightRange(range, "span", {
                className:
                  "bg-yellow-50 outline select-none outline-yellow-50 shadow-[0_0_0_2px,0_1px_2px_1px,0_2px_4px_-2px,inset_0_-1px_1px_-2px,inset_0_0.5px_1px_-2px_rgba(255,255,255,0.2)] shadow-yellow-900/20 rounded-[6px]",
              });
              const highlightId = `preselected-${Date.now()}-${Math.random()}`;
              highlightElementNode.setAttribute(
                "data-highlight-id",
                highlightId,
              );

              addHighlight(highlightId, {
                element: highlightElementNode,
                selection,
              });
            });
          });
        }}
      >
        Select all highlights
      </button> */}
      {/* <button onClick={saveSelection}>Save selection</button>
      <button onClick={restoreSelection}>Restore selection</button> */}
      <div
        className="py-24 px-4 relative"
        ref={containerRef}
        style={{ userSelect: "text" }}
        onMouseUp={modifySelection}
        // onClick={(e) => {
        //   if (e.target.hasAttribute("data-manual-highlight")) {
        //     removeHighlight(e.target);
        //   }
        // }}
      >
        {/* <button onClick={handleGetSelection}>Get selection</button>
      <button onClick={handleHighlight}>Highlight selection</button> */}

        {/* {currentSelection && (
          // <div
          //   className="
          //     absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
          //     after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          //   "
          //   style={{
          //     transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
          //   }}
          // >
          //   <button
          //     className="border bg-brand-primary cursor-pointer select-none w-[180px] h-[40px] border-black text-white"
          //     onClick={handleHighlight}
          //   >
          //     Twitter
          //   </button>
          // </div>

          <div
            className="
            absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          "
            style={{
              transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
            }}
          >
            <button
              className="flex w-full h-full justify-between items-center px-2"
              onClick={modify}
            >
              <span id="share" className="text-xs">
                Share
              </span>
            </button>
          </div>
        )} */}

        {parse(html, {
          trim: true,
        })}
        {/* {sanitizeHtml(html)} */}

        {/* <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
          deserunt eius nihil labore voluptas nostrum hic ducimus soluta
          tempora, porro neque. At, autem in. Libero explicabo voluptatibus
          officiis aliquam obcaecati. Cumque voluptas temporibus repellat vitae
          ipsum est accusantium tenetur fugit!
        </p>
        <h1>Article</h1>
        <p>
          The API’s permission model might seem like extra overhead, but it’s a
          worthwhile trade-off for security and reliability. Gone are the days
          of wrestling with text selection and synchronous clipboard operations.
        </p> */}

        {/* <p className="leading-relaxed">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur
        possimus magni natus nisi, voluptate aliquid assumenda incidunt
        excepturi qui enim necessitatibus molestiae quae ipsam sit laboriosam
        minus. Magnam beatae vitae qui dicta nostrum vel dignissimos illo, optio
        facere. Aliquid numquam non animi architecto accusamus hic
        necessitatibus sit officiis nesciunt excepturi!
      </p> */}

        {/* <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }}></div> */}
        {/* <Script
        src="/scripts/text-highlighter.js"
        strategy="afterInteractive"
        onReady={() => {
          hltrRef.current = new TextHighlighter(articleRef.current, {
            onBeforeHighlight: async function (range) {
              // const confirm = await confirmToast("Do you want to highlight?");
              // if (!confirm) return false;
              return true;
            },
          });
        }}
      /> */}
      </div>
    </>

    // </TextHighlighter>
  );
}

// function confirmToast(message) {
//   return new Promise((resolve) => {
//     const id = toast(message, {
//       action: {
//         label: "Highlight",
//         onClick: () => {
//           toast.dismiss(id);
//           resolve(true);
//         },
//       },
//       duration: Infinity, // keep open until user clicks
//     });

//     // Optionally add a cancel action
//     // setTimeout(() => {
//     //   toast("Cancel", {
//     //     action: {
//     //       label: "Dismiss",
//     //       onClick: () => {
//     //         toast.dismiss(id);
//     //         resolve(false);
//     //       },
//     //     },
//     //   });
//     // }, 0);
//   });
// }

// const SelectMenu = () => {
//   const [selection, setSelection] = useState<string>();
//   const [position, setPosition] = useState<Record<string, number>>();

//   function onSelectStart() {
//     setSelection(undefined);
//   }

//   console.log({ selection });
//   console.log({ position });

//   function onSelectEnd() {
//     const activeSelection = document.getSelection();
//     const text = activeSelection?.toString();

//     if (!activeSelection || !text) {
//       setSelection(undefined);
//       return;
//     }

//     setSelection(text);

//     const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

//     setPosition({
//       x: rect.left + rect.width / 2 - 80 / 2,
//       y: rect.top + window.scrollY - 30,
//       width: rect.width,
//       height: rect.height,
//     });

//     // toast('Share this snippet!', {
//     //   action: {
//     //     label: 'Tweet',
//     //     onClick: () => onShare(text)
//     //   },
//     // })
//   }

//   useEffect(() => {
//     document.addEventListener("selectstart", onSelectStart);
//     document.addEventListener("mouseup", onSelectEnd);
//     return () => {
//       document.removeEventListener("selectstart", onSelectStart);
//       document.removeEventListener("mouseup", onSelectEnd);
//     };
//   }, []);

//   function onShare(text?: string) {
//     const textToShare = text || selection;
//     if (!textToShare) return;
//     const message = [
//       `"${encodeURIComponent(textToShare.substring(0, 120))}"`,
//       encodeURIComponent(window.location.href),
//     ].join("%0A%0A");
//     const url = `https://twitter.com/intent/tweet?text=${message}`;
//     window.open(url, "share-twitter", "width=550, height=550");
//   }

//   return (
//     <div role="dialog" aria-labelledby="share" aria-haspopup="dialog">
//       <Toaster position="bottom-center" />
//       {selection && position && (
//         <p
//           className="
//             absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
//             after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
//           "
//           style={{
//             transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
//           }}
//         >
//           <button
//             className="flex w-full h-full justify-between items-center px-2"
//             onClick={() => onShare()}
//           >
//             <span id="share" className="text-xs">
//               Share
//             </span>
//           </button>
//         </p>
//       )}
//     </div>
//   );
// };

{
  /* <button
        onClick={() => {
          hltrRef.current?.removeHighlights();
        }}
      >
        Remove Highlight
      </button>

      <button
        onClick={() => {
          serializedHighlights.current = hltrRef.current.serializeHighlights();
          console.log(serializedHighlights.current);
          hltrRef.current.removeHighlights();
        }}
      >
        serialize highlights
      </button>

      <button
        onClick={() => {
          hltrRef.current.removeHighlights();
          hltrRef.current.deserializeHighlights(serializedHighlights.current);
        }}
      >
        deserialize highlights
      </button> */
}
