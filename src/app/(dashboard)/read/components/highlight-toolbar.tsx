import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const HighlightToolbar = () => {
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(
    "",
  );
  const [position, setPosition] = useState<Record<string, number>>();

  const sp = useSearchParams();
  const link = sp.get("link");

  function onSelectStart() {
    setCurrentSelection(undefined);
  }
  useEffect(() => {
    let MIN_SHARE_LENGTH = 20;
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

  console.log({ position });

  return (
    <div role="dialog" aria-labelledby="text-highlight-toolbar">
      {currentSelection && position && (
        <div
          className="bg-ui-normal after:border-b-brand-primary absolute -top-2 left-0 m-0 flex h-11 w-55 gap-2 rounded border-dashed after:absolute after:top-full after:left-1/2 after:h-0 after:w-0 after:-translate-x-2 after:rotate-180 after:border-x-[6px] after:border-b-8 after:border-x-transparent"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          <button
            className="hover:bg-ui-hover flex-1 cursor-pointer rounded px-2 text-sm font-medium"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(currentSelection);
                setCurrentSelection(undefined);
                window.getSelection()?.empty();
                console.log("Text copied");
              } catch (err) {
                console.error("Failed to copy:", err);
              }
            }}
          >
            Copy
          </button>

          <a
            className="hover:bg-ui-hover text-text-primary! underline-none! flex flex-1 cursor-pointer items-center justify-center gap-2 rounded bg-none px-2 text-sm no-underline"
            href={`https://bsky.app/intent/compose?text=${encodeURIComponent(
              `${currentSelection}\n\nvia @pocketfeed.at\n\n${link}`,
            )}`}
            target="__blank"
          >
            <span>Share</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#888888"
                  strokeDasharray="80"
                  strokeDashoffset="80"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7.47 5.94c1.83 1.37 3.81 4.14 4.53 5.63c0.72 -1.49 2.7 -4.26 4.53 -5.63c1.33 -0.99 3.47 -1.75 3.47 0.68c0 0.49 -0.28 4.08 -0.45 4.66c-0.57 2.03 -2.65 2.55 -4.5 2.23c3.24 0.55 4.06 2.36 2.28 4.17c-3.38 3.44 -4.85 -0.87 -5.23 -1.97c-0.07 -0.2 -0.1 -0.3 -0.1 -0.22c-0 -0.08 -0.03 0.02 -0.1 0.22c-0.38 1.1 -1.86 5.41 -5.23 1.97c-1.78 -1.81 -0.96 -3.63 2.28 -4.17c-1.85 0.31 -3.93 -0.21 -4.5 -2.23c-0.17 -0.58 -0.45 -4.18 -0.45 -4.66c0 -2.43 2.14 -1.67 3.47 -0.68Z"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.6s"
                    values="80;0"
                  />
                </path>
              </svg>
            </span>
          </a>
        </div>
      )}
    </div>
  );
};

export default HighlightToolbar;
