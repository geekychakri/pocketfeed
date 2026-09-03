"use client";

import localforage from "localforage";
import { mutate } from "swr";
import { useWebMCP } from "use-webmcp-tool";

type MCPArticle = {
  title: string;
  url: string;
  feed: string;
  publishedAt?: string;
};

const ADD_FEED_SCHEMA = {
  type: "object",
  properties: {
    url: {
      type: "string",
      description: "Website or feed URL to subscribe to.",
    },
  },
  required: ["url"],
};

const GET_DAILY_FEED_SCHEMA = {
  type: "object",
  properties: {},
};

const GET_FEED_ARTICLES_SCHEMA = {
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "uri",
      description:
        "A website URL or RSS/Atom feed URL to fetch articles from. The feed does not need to be subscribed to.",
    },
  },
  required: ["url"],
};

const GET_ARTICLE_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "uri",
      description:
        "URL of the article to fetch and extract readable content from.",
    },
  },
  required: ["url"],
};

const SHARE_ARTICLE_TO_BSKY_SCHEMA = {
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "uri",
      description: "The URL of the article, podcast, or video to share.",
    },
    comment: {
      type: "string",
      description:
        "Optional comment to include with the shared link. Use an empty string if no comment was provided.",
    },
  },
  required: ["url"],
};

const MUTATING_ANNOTATIONS = {
  readOnlyHint: false,
  untrustedContentHint: false,
} as const;

export function RegisterWebMCPTools() {
  const addFeedTool = useWebMCP({
    name: "add_feed",
    description:
      "Adds a website's RSS or Atom feed to the user's Pocket Feed. " +
      "The tool discovers the site's feed automatically from the given URL — " +
      "the user does not need to provide the feed URL directly. " +
      "If no feed can be found, or any other error occurs, this is a final " +
      "result: do not retry this tool or call other tools to work around it. " +
      "Report to the user that the feed could not be added, and if the reason " +
      "is known (e.g. no RSS/Atom feed found), include it.",
    inputSchema: ADD_FEED_SCHEMA,
    annotations: MUTATING_ANNOTATIONS,
    execute: async ({ url }) => {
      const res = await fetch("/api/web-mcp/add-feed", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error ?? "Something went wrong!");
      }

      const result = await res.json();

      if (!result.did) {
        throw new Error("Missing user identity in response.");
      }

      mutate(
        `/api/get-user-feeds?did=${result.did}`,
        async (prevFeeds: any) => {
          console.log({ prevFeeds });
          await localforage.setItem(`user-feeds-${result.did}`, [
            ...result?.payload,
            ...prevFeeds,
          ]);
          return [...result?.payload, ...prevFeeds];
        },
        {
          revalidate: false,
        },
      );

      mutate(
        "/api/daily-feeds",
        (current) =>
          current
            ? { ...current, userHasFeeds: true }
            : { dailyFeedItems: [], userHasFeeds: true },
        {
          revalidate: false,
        },
      );

      return {
        message: result.message,
      };
    },
  });

  const dailyFeedTool = useWebMCP({
    name: "get_daily_feed",
    description:
      "Gets articles published today from the user's subscribed RSS/Atom feeds. " +
      "Returns an empty list if the user has no feeds subscribed, or if no new " +
      "articles have been published today — both are normal, not errors. " +
      "When presenting results, format each article as a Markdown link: " +
      "[title](url), optionally with the feed name and publish date. " +
      "Do not display raw JSON to the user.",
    inputSchema: GET_DAILY_FEED_SCHEMA,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
    execute: async () => {
      const res = await fetch("/api/daily-feeds");

      if (!res.ok) {
        const result = await res.json().catch(() => null);

        throw new Error(
          result?.message ??
            result?.error ??
            `Request failed with status ${res.status}`,
        );
      }

      const result = await res.json();

      if (result.dailyFeedItems.length === 0) {
        return {
          message: result.userHasFeeds
            ? "No new articles today. Your feeds haven't published anything new yet — check back later."
            : "You don't have any feeds added yet. Add an RSS feed to start seeing articles here.",
        };
      }

      const articles: MCPArticle[] = result.dailyFeedItems
        .flat()
        .map((item: any) => ({
          title: item.title,
          url: item.link,
          feed: item.feedTitle,
          publishedAt: item.isoDate
            ? new Date(item.isoDate).toISOString()
            : item.pubDate
              ? new Date(item.pubDate).toISOString()
              : undefined,
        }));
      return {
        articles,
      };
    },
  });

  const getLatestFeedArticlesTool = useWebMCP({
    name: "get_latest_feed_articles",
    description:
      "Fetches the latest articles from a website or RSS/Atom feed URL" +
      "(no subscription required). Returns a list of articles, each with title, " +
      "URL, source feed name, and publish date. When presenting results to the " +
      "user, format each article as a Markdown link: [title](url), optionally " +
      "followed by the feed name and publish date. Do not display raw JSON to the user.",
    inputSchema: GET_FEED_ARTICLES_SCHEMA,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
    execute: async ({ url }) => {
      const res = await fetch("/api/web-mcp/get-feed-articles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error ?? "Something went wrong!");
      }

      const result = await res.json();
      return result;
    },
  });

  const getArticleContentTool = useWebMCP({
    name: "get_article_content",
    description:
      "Extracts the full readable content of a single article from its URL " +
      "(strips ads, navigation, and other clutter). Returns the article's title, " +
      "the main content as Markdown, the source URL, and extraction timestamp. " +
      "Use this when the user wants to read, summarize, or ask questions about " +
      "a specific article they've linked, not to discover new articles. " +
      "If the page does not contain readable article content, this is a final " +
      "result — do not retry; tell the user the page could not be extracted.",

    inputSchema: GET_ARTICLE_CONTENT_SCHEMA,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
    execute: async ({ url }) => {
      const res = await fetch("/api/web-mcp/get-article-content", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error ?? "Something went wrong!");
      }

      const result = await res.json();
      return result;
    },
  });

  const shareArticleToBskyTool = useWebMCP({
    name: "share_article_to_bsky",
    description:
      "Shares an article as a public post to the user's Bluesky account. " +
      "This publishes visibly to the user's Bluesky profile and cannot be " +
      "undone by this tool. Use only when the user explicitly asks to share, " +
      "post, or publish the article — not for saving, bookmarking, or " +
      "expressing interest in it. The comment is optional; if the user does " +
      "not provide a comment, pass an empty string for text. Do not invent " +
      "a comment unless the user explicitly asks you to. If sharing fails, " +
      "this is a final result; do not retry — report the failure to the user.",
    inputSchema: SHARE_ARTICLE_TO_BSKY_SCHEMA,
    annotations: {
      readOnlyHint: false,
      untrustedContentHint: false,
    },
    execute: async ({ url, comment }) => {
      const res = await fetch("/api/web-mcp/share-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          comment: comment ?? "",
        }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error ?? "Something went wrong!");
      }

      const result = await res.json();
      return result;
    },
  });

  const staticTools = [
    addFeedTool,
    dailyFeedTool,
    getLatestFeedArticlesTool,
    getArticleContentTool,
    shareArticleToBskyTool,
  ];
  const registrationError = [...staticTools].find((tool) => tool.error)?.error;
  const isSupported = staticTools.every((tool) => tool.supported);
  const staticToolsReady = staticTools.every((tool) => tool.registered);
  const allExpectedToolsReady = staticToolsReady;
  const toolCount = staticTools.length;

  let status = "Checking WebMCP…";
  if (registrationError) {
    status = "WebMCP registration failed";
  } else if (!isSupported) {
    status = "WebMCP unavailable";
  } else if (allExpectedToolsReady) {
    status = `WebMCP ready · ${toolCount} tools`;
  } else {
    status = "Registering WebMCP tools…";
  }

  return (
    <div
      className="text-text-secondary fixed top-5 right-5 flex items-center gap-2 text-sm font-medium max-sm:hidden"
      role="status"
      title={registrationError?.message}
    >
      <span aria-hidden="true" />
      <span className="relative flex size-2">
        <span className="bg-brand-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
        <span className="bg-brand-primary relative inline-flex size-2 rounded-full"></span>
      </span>
      {status}
    </div>
  );
}
