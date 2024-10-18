"use client";

import DOMPurify from "isomorphic-dompurify";

export default function Article({ content }: { content: string }) {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <img
          src="/nothing-to-read.svg"
          className="w-[320px]"
          alt="nothing-to-read-svg"
        />
        <p>Hmm, there&apos;s nothing to read!</p>
      </div>
    );
  }
  return (
    <>
      <article
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        // className="relative text-lg leading-normal"
        className="prose"
      ></article>
    </>
  );
}
