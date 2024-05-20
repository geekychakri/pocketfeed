"use client";

export default function Article({ content }: { content: string }) {
  return (
    <>
      <article
        dangerouslySetInnerHTML={{ __html: content }}
        className="leading-normal text-lg relative"
      ></article>
    </>
  );
}
