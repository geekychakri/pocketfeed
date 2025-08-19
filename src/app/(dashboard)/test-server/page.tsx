// import { convertXML } from "simple-xml-to-json";
// import Parser from "rss-parser";
// const parser = new Parser({
//   customFields: {
//     item: ["podcast:chapters"],
//   },
// });

import { codeToHtml } from "shiki";
import { createHighlighter } from "shiki";
const htmlString = `
  <p>Here is some code:</p><pre><code class="language-js">const msg = "Hello Shiki!";console.log(msg);</code></pre>
`;
export default async function TestServer() {
  // const res = await fetch(
  //   "https://full-rss.deno.dev?url=https://jakearchibald.com/posts.rss",
  // );
  // const data = await res.text();
  // const myJSON = await parser.parseString(data);
  // console.log({ myJSON: myJSON.items[1] });
  const html = await code(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}

async function code(htmlContent: string) {
  const highlighter = await createHighlighter({
    themes: ["nord"],
    langs: ["javascript"],
  });

  // const content = htmlContent.replace(
  //   /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
  //   (match, lang, code) => {
  //     // Decode HTML entities if needed
  //     const decodedCode = code
  //       .replace(/&lt;/g, "<")
  //       .replace(/&gt;/g, ">")
  //       .replace(/&amp;/g, "&")
  //       .replace(/&quot;/g, '"');
  //   },
  // );
  const replacedHTML = htmlContent.replace(
    /<pre[^>]*>\s*<code\s+class="language-(.+?)"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (match, lang, code) => {
      // Decode HTML entities & trim
      const cleanCode = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

      // Highlight with shiki
      return highlighter.codeToHtml(cleanCode, {
        lang,
        theme: "nord",
      });
    },
  );
  return replacedHTML;
}
