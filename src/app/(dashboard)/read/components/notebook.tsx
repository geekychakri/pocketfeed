"use client";

import { parse } from "node:path";
import { useEffect } from "react";

import { TrashIcon } from "@radix-ui/react-icons";

import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import { useArticleHighlights } from "@/store/article-highlights";
import { useHighlighterRef } from "@/store/highlighterRef";
import { useFullscreen } from "@/store/read-fullscreen";
import { useToggleNotebook } from "@/store/toggle-notebook";
import useStore from "@/store/useStore";

export default function Notebook() {
  const { highlights } = useArticleHighlights();
  const { hltrRef } = useHighlighterRef();
  const isNoteBookOpen = useStore(
    useToggleNotebook,
    (state) => state.isNotebookOpen,
  );

  const isNotebookHydrated = useStore(
    useToggleNotebook,
    (state) => state.isNotebookRehydrated,
  );

  // useEffect(() => {
  //   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  //     anchor.addEventListener("click", function (e) {
  //       e.preventDefault();

  //       anchor.scrollIntoView({
  //         behavior: "smooth",
  //       });
  //     });
  //   });
  // });

  console.log({ highlights });

  const parsedHighlights = highlights.reduce((acc, item) => {
    const key = item[5]; // the timestamp/id

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});

  if (!isNotebookHydrated) {
    return null;
  }
  return (
    <div
      // className={`${isNoteBookOpen ? "sticky h-screen top-0 w-full bg-red-300 block" : "hidden"} transition-all`}
      className={`${isNoteBookOpen ? "translate-x-0 " : "translate-x-full "} border-l flex flex-col sticky h-screen top-0 w-full transition-[translate] starting:translate-x-full duration-250`}
      inert={!isNoteBookOpen ? true : false}
    >
      <div className="h-14 flex items-center border-b px-4">
        <h1>Notebook</h1>
      </div>
      <div className="p-4 border-b">
        <form action="">
          <div className="flex flex-col gap-2">
            <label htmlFor="note-textarea text-sm">Add a note</label>
            <Textarea
              id="note-textarea"
              placeholder="lorem ipsum..."
            ></Textarea>
          </div>
        </form>
      </div>

      <div className="py-5 flex-1 overflow-auto scrollbar-width-thin overscroll-contain">
        <h2 className="font-medium px-4 mb-5">Highlights</h2>

        <div className="flex flex-col">
          {Object.entries(parsedHighlights).map(([key, items]) => (
            <div
              key={key}
              className="mb-4 p-4 grid  grid-cols-[1fr_44px]  not-last:border-b"
            >
              <div className="col-start-1">
                {items.map((item, index) => (
                  <a
                    className="block mb-4 underline underline-offset-4 decoration-[#bdbd1b]"
                    href={`#${item[5]}`}
                    key={index}
                  >
                    {item[1]}
                  </a>
                ))}
              </div>

              <button
                className="bg-danger h-11 rounded-md cursor-pointer self-start flex items-center justify-center text-white col-start-2"
                // className="bg-danger h-11"
                onClick={() => {
                  // const match = item[0].match(/data-timestamp="(\d+)"/);
                  // const timestamp = match ? match[1] : null;
                  const timestamp = key;

                  if (timestamp) {
                    const elements = document.querySelectorAll(
                      `[data-timestamp="${timestamp}"]`,
                    );

                    elements.forEach((el) => {
                      hltrRef.current.removeHighlights(el);
                    });
                  }
                }}
              >
                <span className="sr-only">Delete highlight</span>
                <TrashIcon className="size-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
