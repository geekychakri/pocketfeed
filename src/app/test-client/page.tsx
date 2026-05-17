// import dynamic from "next/dynamic";

// import NoSSR from "./components/no-ssr";

import { Suspense } from "react";

import Parser from "rss-parser";

import { parse } from "@/lib/vtt-srt-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["podcast:chapters", "podcast:chapters"],
      ["podcast:transcript", "podcast:transcript", { keepArray: true }],
    ],
  },
});

export default async function Page() {
  console.log("PAGE");
  return (
    <Suspense fallback="Loading...">
      <Feed />
    </Suspense>
  );
}

const Feed = async () => {
  const res = await fetch(
    "https://share.transistor.fm/s/4aa9638e/transcription",
  );

  const vttText = await res.text();

  // const parsed = parse(vttText);

  return <div>{vttText}hello</div>;
};
