import { isProbablyReaderable, Readability } from "@mozilla/readability";
import * as Sentry from "@sentry/nextjs";
import { guardedFetch } from "guarded-fetch";
import { JSDOM } from "jsdom";
import { htmlToMarkdown } from "mdream";

import getSession from "@/lib/iron-session/get-iron-session";
import { isHttpValid } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const articleLink = url;
    console.log({ articleLink });

    const isValidUrl = isHttpValid(articleLink);

    if (!isValidUrl) {
      return Response.json(
        {
          error: "Not a valid url.",
        },
        { status: 401 },
      );
    }

    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          error: "You must be signed in to extract article.",
        },
        { status: 401 },
      );
    }

    const response = await guardedFetch(articleLink);
    const html = await response.text();

    const dom = new JSDOM(html, {
      url: articleLink,
    });

    if (isProbablyReaderable(dom.window.document)) {
      const reader = new Readability(dom.window.document); //TODO:

      const article = reader.parse();

      const htmlContent = article?.content as string;

      const markDownContent = htmlToMarkdown(htmlContent);

      const articleResponse = {
        title: article?.title,
        content: markDownContent,
        url: articleLink,
        extractedAt: new Date().toISOString(),
      };

      console.log({ article: articleResponse });

      return Response.json(articleResponse);
    } else {
      console.log("NOT READABLE");
      return Response.json(
        {
          error: "The page does not contain readable article content.",
        },
        { status: 422 },
      );
    }
  } catch (err) {
    Sentry.captureException(err, {
      tags: { api: "extract-article" },
    });
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
