import React from "react";

export function useWatchScrollAreaOverflow(
  ref: React.MutableRefObject<HTMLDivElement | null>,
) {
  const [overflown, setOverflown] = React.useState(false);
  const height = React.useRef(0);
  const observer = React.useRef<ResizeObserver | null>(null);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ref.current &&
      ref.current.firstChild
    ) {
      observer.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const h = entry.contentRect.height;
          if (h !== height.current) {
            height.current = h;
            if (ref.current) {
              setOverflown(ref.current.scrollHeight > ref.current.clientHeight);
            }
          }
        }
      });
      observer.current.observe(ref.current.firstChild as HTMLElement);
    }
    return () => {
      observer.current?.disconnect();
    };
  }, [ref.current?.firstChild]);

  return overflown;
}
