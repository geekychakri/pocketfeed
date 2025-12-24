"use client";

import { useMemo, useState } from "react";

const html = `<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
deserunt eius nihil labore voluptas nostrum hic ducimus soluta tempora,
porro neque. At, autem in. Libero explicabo voluptatibus officiis
aliquam obcaecati. Cumque voluptas temporibus repellat vitae ipsum est
accusantium tenetur fugit!
</p>
<h1 class="text-2xl">Article</h1>
<p>The API’s permission model might seem like extra overhead, but it’s a
worthwhile trade-off for security and reliability. Gone are the days of
wrestling with text selection and synchronous clipboard operations. lorem10</p>
`;

export default function DangerousHTML() {
  const [highlights, setHighlights] = useState([]);
  const memoizedHTML = useMemo(() => ({ __html: html }), [html]);
  return (
    <div
      key="static-html"
      dangerouslySetInnerHTML={memoizedHTML}
      onMouseUp={() => {
        console.log("hello");
        setHighlights([]);
      }}
    ></div>
  );
}
