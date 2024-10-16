"use client";

export default function Article({ content }: { content: string }) {
  return (
    <>
      <article
        dangerouslySetInnerHTML={{ __html: content }}
        // className="relative text-lg leading-normal"
        className="prose lg:prose-xl"
      ></article>
    </>
  );
}
