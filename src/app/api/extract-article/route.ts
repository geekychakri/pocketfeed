import { isProbablyReaderable, Readability } from "@mozilla/readability";
import * as Sentry from "@sentry/nextjs";
import { JSDOM, VirtualConsole } from "jsdom";

import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
  try {
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
    Sentry.captureException(err, {
      tags: { api: "extract-article" },
    });
    return Response.json("", { status: 500 });
  }
}
