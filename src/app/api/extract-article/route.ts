import { extract } from "@extractus/article-extractor";
import { isProbablyReaderable, Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";
import { DOMParser } from "linkedom";

import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
  try {
    // throw new Error("");
    const { searchParams } = new URL(request.url);
    const articleLink = searchParams.get("articleLink") as string;
    console.log({ articleLink });

    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to extract article.",
        },
        { status: 401 },
      );
    }

    const virtualConsole = new VirtualConsole();

    const dom = await JSDOM.fromURL(articleLink, {
      virtualConsole,
    });

    if (isProbablyReaderable(dom.window.document)) {
      const reader = new Readability(dom.window.document); //TODO:
      // const article = await extract(articleLink, null, {
      //   signal: AbortSignal.timeout(10000),
      // });
      // const article = reader.parse();

      // console.log({ extractedArticle: article });

      // const modifiedHTML = modifyImgUrlAndReturnHTML(
      //   article?.content,
      //   articleLink,
      // );
      const article = reader.parse();
      const articleResponse = {
        ...article,
        content: article?.content,
        link: articleLink,
      };

      console.log({ article: articleResponse });

      return Response.json(articleResponse);
    } else {
      console.log("NOT READABLE");
      return Response.json({ content: null });
    }
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
