"use client";

// Only works in client components
import { useQueryState } from "nuqs";

export default function SearchFeed() {
  const [feedTitle, setFeedTitle] = useQueryState("title");
  return (
    <>
      <input
        value={feedTitle || ""}
        onChange={(e) => setFeedTitle(e.target.value)}
      />
    </>
  );
}
