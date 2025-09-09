import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";

import { extract } from "@extractus/article-extractor";

export async function GET(request: Request) {
  try {
    // throw new Error("");
    const { searchParams } = new URL(request.url);
    const articleLink = searchParams.get("articleLink") as string;
    console.log({ articleLink });

    const virtualConsole = new VirtualConsole();

    const dom = await JSDOM.fromURL(articleLink, {
      virtualConsole,
    });

    if (isProbablyReaderable(dom.window.document)) {
      // const reader = new Readability(dom.window.document); //TODO:
      const article = await extract(articleLink);
      // const article = reader.parse();

      console.log({ extractedArticle: article });

      return Response.json(article);
    } else {
      console.log("NOT READABLE");
      return Response.json({ content: null });
    }
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
