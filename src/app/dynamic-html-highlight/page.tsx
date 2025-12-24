"use client";

import { memo, use, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

import parse from "html-react-parser";
import { flushSync } from "react-dom";

const html = `<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
deserunt eius nihil labore voluptas nostrum hic ducimus soluta tempora,
porro neque. At, autem in. Libero explicabo voluptatibus officiis
aliquam obcaecati. Cumque voluptas temporibus repellat vitae ipsum est
accusantium tenetur fugit!
</p>
<h1>Article</h1>
<p>The API’s permission model might seem like extra overhead, but it’s a
worthwhile trade-off for <em>security</em> and reliability. Gone are the days of
wrestling with text selection and synchronous clipboard operations. lorem10</p>
`;

const initHlts = [
  [
    '<span class="highlighted" data-timestamp="1764314047155" style="background-color: rgb(255, 255, 123);" data-highlighted="true"></span>',
    "sit amet",
    "0:1",
    18,
    8,
  ],
  // [
  //   '<span class="highlighted" data-timestamp="1764314048245" style="background-color: rgb(255, 255, 123);" data-highlighted="true"></span>',
  //   "Gone are the days of\nwrestling with text selection and synchronous clipboard operations. lorem10",
  //   "4:1",
  //   121,
  //   96,
  // ],
];

const savedHlts = JSON.stringify([
  [
    '<span class="highlighted" data-timestamp="1764314047155" style="background-color: rgb(255, 255, 123);" data-highlighted="true"></span>',
    "sit amet",
    "0:1",
    18,
    8,
  ],
  // [
  //   '<span class="highlighted" data-timestamp="1764314048245" style="background-color: rgb(255, 255, 123);" data-highlighted="true"></span>',
  //   "Gone are the days of\nwrestling with text selection and synchronous clipboard operations. lorem10",
  //   "4:1",
  //   121,
  //   96,
  // ],
]);
export default function Page() {
  const [highlights, setHighlights] = useState(initHlts);
  const articleRef = useRef<HTMLElement | null>(null);
  const hltrRef = useRef();
  const serializedHighlightsRef = useRef([]);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [position, setPosition] = useState<Record<string, number>>();

  console.log({ highlights });
  const memoizedHTML = useMemo(() => ({ __html: html }), []);

  function onSelectStart() {
    setCurrentSelection(undefined);
  }

  const onSelectEnd = () => {
    const selection = window.getSelection();
    console.log({ selection: selection?.toString() });
    // setCurrentSelection("hello");
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

  const deleteHighlight = (e) => {};

  useEffect(() => {
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("mouseup", onSelectEnd, true);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("mouseup", onSelectEnd);
    };
  }, []);

  console.log({ currentSelection });
  return (
    <main className="relative">
      <button>Find</button>
      <button
        onClick={() => {
          console.log(hltrRef.current.serializeHighlights());
          // serializedHighlightsRef.current =
          //   hltrRef.current.serializeHighlights();
          // hltrRef.current.removeHighlights();
        }}
      >
        Serialize
      </button>
      <button
        onClick={() =>
          hltrRef.current.deserializeHighlights(serializedHighlightsRef.current)
        }
      >
        DeSerialize
      </button>
      <button
        onClick={() => hltrRef.current.removeHighlights(articleRef.current)}
      >
        Remove highlight
      </button>
      <hr />

      <button onClick={() => console.log(hltrRef.current.getHighlights())}>
        get highlights
      </button>
      <hr />

      <div role="dialog" aria-labelledby="share" aria-haspopup="dialog">
        {currentSelection && position && (
          <p
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
              onClick={deleteHighlight}
            >
              <span id="share" className="text-xs">
                Delete
              </span>
            </button>
          </p>
        )}
      </div>
      <article
        ref={articleRef}
        className="p-5"
        // dangerouslySetInnerHTML={memoizedHTML}
        onClick={(e) => {
          if (e.target.classList.contains("highlighted")) {
            const getId = e.target.dataset.timestamp;
            console.log(e.target);
            console.log(typeof e.target);
            // hltrRef.current.removeHighlights(e.target);
          }
        }}
      >
        <p>
          Lorem ipsum dolor, sit amet consectetur <em>adipisicing</em> elit. In,
          repudiandae!
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus,
          ipsum commodi blanditiis aperiam distinctio alias sapiente rerum
          doloribus amet laudantium sunt corporis perspiciatis. Ducimus vitae
          qui, id rem magnam tempora?{" "}
          <em>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Necessitatibus, ad.
          </em>
        </p>
      </article>
      {/* <ArticleContent articleRef={articleRef} html={html} /> */}
      <hr />
      <h2>Highlights</h2>
      {highlights.map((item, i) => {
        console.log(typeof item[0]);
        return (
          <div key={i}>
            <p>{item[1]}</p>
            {/* <p>{item[0]}</p> */}
            <button
              onClick={() => {
                const match = item[0].match(/data-timestamp="(\d+)"/);
                const timestamp = match ? match[1] : null;
                console.log({ timestamp });
                const element = document.querySelector(
                  `[data-timestamp="${timestamp}"]`,
                );

                if (element) {
                  hltrRef.current.removeHighlights(element);
                }
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
      <Script
        src="/scripts/text-highlighter.js"
        onReady={() => {
          hltrRef.current = new TextHighlighter(articleRef.current, {
            onBeforeHighlight: function (range) {
              console.log({ range: range.getBoundingClientRect().width });
              const rect = range.getBoundingClientRect();
              // setPosition({
              //   // 80 represents the width of the share button, this may differ for you
              //   x: rect.left + rect.width / 2 - 80 / 2,
              //   // 30 represents the height of the share button, this may differ for you
              //   y: rect.top + window.scrollY - 30,
              //   width: rect.width,
              //   height: rect.height,
              // });
              // }
              // rangeRef.current = range.cloneRange();
              // console.log({ rangeRef: rangeRef.current });
              // // const confirm = await confirmToast("Do you want to highlight?");
              // // if (!confirm) return false;
              // // return true;
              // return true;
              // if (manualRef.current) return true;

              // // If automatic selection, block it
              // rangeRef.current = range.cloneRange();
              // return false;
              return true;
            },
            onAfterHighlight: function (range, highlights) {
              // console.log({ inlineHighlights: highlights });
              hltrRef.current.mergeSiblingHighlights(highlights);
              // console.log({ getHighlights: hltrRef.current.getHighlights() });
              // // console.log(JSON.parse(hltrRef.current.serializeHighlights()));
              // const getSerializedHighlights = JSON.parse(
              //   hltrRef.current.serializeHighlights(),
              // );

              // console.log({ getSerializedHighlights });

              // const unique = Array.from(
              //   new Set(
              //     getSerializedHighlights.map((item) => JSON.stringify(item)),
              //   ),
              // ).map((str) => JSON.parse(str));
              // console.log({ unique });
              // setHighlights([...unique]);
            },
          });

          hltrRef.current.deserializeHighlights(savedHlts);
        }}
      />
    </main>
  );
}

const ArticleContent = ({
  articleRef,
  html,
}: {
  articleRef: any;
  html: any;
}) => {
  return (
    <article ref={articleRef} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

memo(ArticleContent);
