"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { decode } from "html-entities";
import DOMPurify from "isomorphic-dompurify";
import localforage from "localforage";
import useSWR from "swr";
import useSound from "use-sound";

import NothingToReadSVG from "@/components/svg/nothing-to-read";

import { ExternalLinkIcon } from "@/icons/external-link";
import { FeedItemType } from "@/types";

import HoverPrefetchLink from "../../components/hover-prefetch-link";
import ArticleText from "./article-text";

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && node.getAttribute("href")?.startsWith("#")) {
    node.removeAttribute("target");
  }

  // if (node.tagName === "A" && !node.hasAttribute("target")) {
  //   node.setAttribute("target", "_blank");
  // }

  // if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
  //   node.setAttribute("rel", "noopener noreferrer");
  // }

  // if (node.tagName === "P") {
  //   //TODO: flatten p tag for highlighting
  //   node.textContent = node.textContent;
  // }
});

function convertRelativeUrlsToAbsolute(html: string, baseUrl: string) {
  if (!html) {
    return "";
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const isRelativeUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false;

    // Check for absolute URLs (protocol + hostname)
    if (url.match(/^https?:\/\//i)) return false;

    // Check for protocol-relative URLs (//example.com)
    if (url.startsWith("//")) return false;

    // Check for data URLs, mailto, tel, etc.
    if (url.match(/^[a-z]+:/i)) return false;

    return true;
  };

  // Elements with URL attributes
  const elementsWithUrls = doc.querySelectorAll("[href], [srcset], [src]");

  elementsWithUrls.forEach((el) => {
    if (el.hasAttribute("src")) {
      const src = el.getAttribute("src");
      // try {
      //   el.setAttribute("src", new URL(src, baseUrl).href);
      // } catch (_) {}
      if (src && isRelativeUrl(src)) {
        try {
          el.setAttribute("src", new URL(src as string, baseUrl).href);
        } catch (_) {}
      }
    }

    if (el.hasAttribute("srcset")) {
      const srcset = el.getAttribute("srcset");
      if (srcset && isRelativeUrl(srcset)) {
        try {
          // srcset can contain multiple URLs with descriptors
          // For proper srcset handling, you might want to parse each URL separately
          const urls = srcset.split(",").map((entry) => {
            const [url, descriptor] = entry.trim().split(/\s+/);
            if (isRelativeUrl(url)) {
              try {
                return (
                  new URL(url, baseUrl).href +
                  (descriptor ? " " + descriptor : "")
                );
              } catch (_) {
                return entry.trim();
              }
            }
            return entry.trim();
          });
          el.setAttribute("srcset", urls.join(", "));
        } catch (_) {}
      }
    }
  });

  return doc.body.innerHTML;
}

export default function Article({ articleUrl }: { articleUrl: string }) {
  const feedItem = localStorage.getItem("feedItem")
    ? JSON.parse(localStorage.getItem("feedItem") as string)
    : null;

  console.log({ feedItem });

  const { data } = useSWR(`/api/extract-article?articleLink=${articleUrl}`);

  console.log({ data });

  const articleLinkOrigin = new URL(articleUrl).origin;

  const [copySound] = useSound("/sounds/copy.wav");

  // console.log({ pathname });

  // const {
  //   articleContent,

  //   articleLink,
  //   isExtracted,
  //   setIsArticleExtracted,
  // } = useArticleContent();

  console.log({ articleUrl });
  // console.log({ articleLink });

  useEffect(() => {
    // alert("hello");
    document.querySelectorAll("pre").forEach((pre) => {
      if (pre.dataset.processed === "true") return;
      pre.dataset.processed = "true";
      // Create wrapper, button, and message elements
      const wrapper = document.createElement("div");
      const button = document.createElement("button");

      wrapper.style.position = "relative";
      button.innerHTML = "Copy";

      button.className = "copy-code-btn";

      // Add wrapper and button to the DOM
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(button);

      // Copy action
      button.addEventListener("click", () => {
        button.disabled = true;
        button.innerHTML = "Copied!";
        // animate("#svgIconCheck", { opacity: 1 }, { duration: 0.5 });
        copySound();
        navigator.clipboard
          .writeText(pre.textContent as string)
          .then(() => {
            setTimeout(() => {
              button.innerHTML = "Copy";
              button.disabled = false;
              // animate("#svgIconCopy", { opacity: 1 }, { duration: 0.5 });
            }, 3000);
          })
          .catch((err) => console.error("Error copying text: ", err));
      });
    });
  }, [copySound]);

  // useLayoutEffect(() => {
  //   return () => {
  //     setIsArticleExtracted(false);
  //   };
  // }, [setIsArticleExtracted]);

  let contentToRead: string;
  if (data?.content === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <NothingToReadSVG className="w-[320px]" />
        <p>Hmm, there&apos;s nothing to read!</p>
      </div>
    );
  }
  if (data?.link === articleUrl) {
    contentToRead = convertRelativeUrlsToAbsolute(
      data?.content,
      articleLinkOrigin,
    );
  } else {
    contentToRead = convertRelativeUrlsToAbsolute(
      feedItem["content:encoded"] || feedItem.content,
      // feedItem.content,
      articleLinkOrigin,
    );
  }

  console.log({ contentToRead });

  // console.log({ isExtracted });

  // toggle article tag based on fetch data it article is extracted on user click remove article tag

  return (
    <>
      <div className="relative mb-12 flex flex-col gap-2 px-4 pt-2.5">
        {/* <RouteBack className="absolute -left-9 p-2" /> */}
        <h1 className="flex min-h-14 items-center gap-2 text-[48px] leading-13 font-[575] tracking-tighter text-balance">
          {decode(feedItem?.title)}
        </h1>
        {/*{!blogName ? (
          <span className="text-text-secondary">{feedItem?.author}</span>
        ) : null}*/}
      </div>

      {contentToRead && (
        <ArticleText
          contentToRead={DOMPurify.sanitize(contentToRead, {
            FORBID_TAGS: ["style", "em"],
            FORBID_ATTR: ["style"],
          })}
        />
      )}

      <ReadNextList />
    </>
  );
}

type ReadNextFeedDataType = {
  items: FeedItemType[];
  link: string;
};

function ReadNextList() {
  const [feedData, setFeedData] = useState<ReadNextFeedDataType | null>(null);

  const searchParams = useSearchParams();

  const link = searchParams.get("link");
  const source = searchParams.get("source");

  const getFeedItem = JSON.parse(localStorage.getItem("feedItem") as string);

  useEffect(() => {
    const getFeedData = async () => {
      const data =
        await localforage.getItem<ReadNextFeedDataType>("browse-feed");
      setFeedData(data);
    };

    getFeedData();
  }, []);

  if (source === "daily") {
    return (
      <div className="flex flex-col gap-5 p-4">
        <HoverPrefetchLink
          href={`/feed?feedUrl=${getFeedItem.feedUrl}`}
          className="text-brand-primary custom-underline flex items-center gap-1 self-start"
        >
          More from this blog
        </HoverPrefetchLink>
      </div>
    );
  }

  if (!feedData) return null;

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-lg font-medium">More from this blog</h2>
      <div className="flex flex-col gap-4">
        {/*{feedData.items.map((item, index) => {
          return (
            <Link
              key={index}
              href={`/read?link=${item.link}`}
              onNavigate={(e) => {
                localStorage.setItem("feedItem", JSON.stringify(item));
              }}
              className="custom-underline self-start"
            >
              {item.title}
            </Link>
          );
        })}*/}
        {feedData.items.flatMap((item, index) => {
          if (item.link !== link) {
            return (
              <HoverPrefetchLink
                key={index}
                href={`/read?link=${item.link}`}
                onNavigate={(e) => {
                  localStorage.setItem("feedItem", JSON.stringify(item));
                }}
                className="custom-underline self-start"
              >
                {item.title}
              </HoverPrefetchLink>
            );
          }
        })}
      </div>
      <a
        href={feedData.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary flex items-center gap-1"
      >
        Visit original page <ExternalLinkIcon />
      </a>
    </div>
  );
}
