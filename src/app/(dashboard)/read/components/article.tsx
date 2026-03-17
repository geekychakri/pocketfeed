"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

import { decode } from "html-entities";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import localforage from "localforage";
import useSWR, { useSWRConfig } from "swr";
import useSound from "use-sound";

import { SpinnerRotate } from "@/components/spinner-rotate";
import NothingToReadSVG from "@/components/svg/nothing-to-read";

import { ExternalLinkIcon } from "@/icons/external-link";
// import { addPostAction } from "@/app/actions/add-post";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, internalErrorToast } from "@/lib/utils";
import { useArticleContent } from "@/store/article-content";

// import { useArticles } from "@/store/articles-list";

import ArticleText from "./article-text";

export interface TextSelection {
  /** The selected text content */
  text: string;
  /** The DOM range object representing the selection */
  range: Range;
  /** Absolute position coordinates of the selection */
  position: {
    x: number;
    y: number;
  };
  /** Bounding rectangle of the selection */
  boundingRect: DOMRect;
}

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

const initialState = {
  message: "",
};

export default function Article({ articleUrl }: { articleUrl: string }) {
  // const [feedItem, _] = useState(() => {
  //   return localStorage.getItem("feedItem")
  //     ? JSON.parse(localStorage.getItem("feedItem") as string)
  //     : null;
  // });

  const feedItem = localStorage.getItem("feedItem")
    ? JSON.parse(localStorage.getItem("feedItem") as string)
    : null;

  console.log({ feedItem });

  // console.log({ articleUrl });
  let isNewArticle = false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fetchArticle, setFetchArticle] = useState(false);

  // const [state, formAction] = useActionState(addPostAction, initialState);

  // const pathname = usePathname();
  // const { link } = useParams<{ link: string }>();
  const articleLinkOrigin = new URL(articleUrl).origin;

  const searchParams = useSearchParams();

  const blogName = searchParams.get("author");

  const [copySound] = useSound("/sounds/copy.wav");

  // console.log({ pathname });

  const articleRef = useRef(null);
  const effectRan = useRef(false);

  const { articleContent, articleTitle, articleLink, isExtracted } =
    useArticleContent();

  // const { onError } = useSWRConfig();

  // If someone deletes localstorage by mistake
  // const { data, error, isLoading } = useSWR<{
  //   content: string;
  //   title: string;
  //   author: string;
  //   source: string;
  // }>(
  //   feedItem ? null : `/api/extractArticle?articleLink=${articleUrl}`,
  //   fetcher,
  //   {
  //     keepPreviousData: true,
  //     // revalidateIfStale: true,
  //     // revalidateOnMount: true,
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //     onError: (error, key) => {
  //       if (error.status === 500) {
  //         internalErrorToast(INTERNAL_ERROR_MESSAGE);
  //       }
  //     },
  //     onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  //       // Never retry on 404.
  //       if (error.status === 500) return;

  //       // Only retry up to 5 times.
  //       if (retryCount >= 5) return;
  //     },
  //   },
  // );

  console.log({ articleUrl });
  console.log({ articleLink });

  let contentToRead: string;

  if (articleUrl === articleLink) {
    contentToRead = articleContent;
  } else {
    contentToRead = convertRelativeUrlsToAbsolute(
      feedItem["content:encoded"] || feedItem.content,
      // feedItem.content,
      articleLinkOrigin,
    );
  }

  console.log({ contentToRead });

  useEffect(() => {
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
  }, [copySound, isExtracted]);

  if (isExtracted) {
    console.log("IS EXTRACTED!");
    if (articleContent === null) {
      return (
        <div className="flex flex-col items-center justify-center gap-6">
          <NothingToReadSVG className="w-[320px]" />
          <p>Hmm, there&apos;s nothing to read!</p>
        </div>
      );
    }
  }

  // if (data?.content === null) {
  //   return (
  //     <div className="flex flex-col items-center justify-center gap-6">
  //       <NothingToReadSVG className="w-[320px]" />
  //       <p>Hmm, there&apos;s nothing to read!</p>
  //     </div>
  //   );
  // }

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <SpinnerRotate />
  //     </div>
  //   );
  // }

  // toggle article tag based on fetch data it article is extracted on user click remove article tag

  return (
    <>
      <div className="relative mb-12 flex flex-col gap-2 pt-[10px] px-4">
        {/* <RouteBack className="absolute -left-9 p-2" /> */}
        <h1 className="flex min-h-14 items-center gap-2 text-[48px] leading-[52px] font-[575] tracking-tighter text-balance">
          {decode(feedItem?.title)}
        </h1>
        {/*{!blogName ? (
          <span className="text-text-secondary">{feedItem?.author}</span>
        ) : null}*/}
      </div>

      <ArticleText
        contentToRead={DOMPurify.sanitize(contentToRead, {
          FORBID_TAGS: ["style", "em"],
          FORBID_ATTR: ["style"],
        })}
      />
      <ReadNextList />
    </>
  );
}

const svgIconCopy = `<svg xmlns="http://www.w3.org/2000/svg" id="svgIconCopy" opacity="0"  width="18" height="18" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M15 1.25h-4.056c-1.838 0-3.294 0-4.433.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433V16a3.75 3.75 0 0 0 3.166 3.705c.137.764.402 1.416.932 1.947c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h3.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-5.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26c-.531-.53-1.183-.795-1.947-.932A3.75 3.75 0 0 0 15 1.25m2.13 3.021A2.25 2.25 0 0 0 15 2.75h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S4.025 4.705 3.89 5.71c-.138 1.029-.14 2.383-.14 4.29v6a2.25 2.25 0 0 0 1.521 2.13c-.021-.61-.021-1.3-.021-2.075v-5.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.602-.602 1.36-.86 2.26-.981c.867-.117 1.97-.117 3.337-.117h3.11c.775 0 1.464 0 2.074.021M7.408 6.41c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h3c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v5c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103h-3c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191v-5c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399" clip-rule="evenodd"/></svg>`;
const svgIconCheck = `<svg xmlns="http://www.w3.org/2000/svg" opacity="0" id="svgIconCheck" width="20" height="20" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M18.493 6.935a.75.75 0 0 1 .072 1.058l-7.857 9a.75.75 0 0 1-1.13 0l-3.143-3.6a.75.75 0 0 1 1.13-.986l2.578 2.953l7.292-8.353a.75.75 0 0 1 1.058-.072" clip-rule="evenodd"/></svg>`;

// function processHtmlWithSyntaxHighlighting(
//   htmlContent: string,
//   highlighter: any,
// ) {
//   const parsedHighlighter = JSON.parse(highlighter);
//   return htmlContent.replace(
//     /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
//     (match, lang, code) => {
//       // Decode HTML entities if needed
//       const decodedCode = code
//         .replace(/&lt;/g, "<")
//         .replace(/&gt;/g, ">")
//         .replace(/&amp;/g, "&")
//         .replace(/&quot;/g, '"');

//       return parsedHighlighter.codeToHtml(decodedCode, {
//         lang: lang,
//         theme: "night-owl",
//       });
//     },
//   );
// }

function ReadNextList() {
  const [feedData, setFeedData] = useState();

  const searchParams = useSearchParams();

  const link = searchParams.get("link");
  const source = searchParams.get("source");

  const getFeedItem = JSON.parse(localStorage.getItem("feedItem") as string);

  useEffect(() => {
    const getFeedData = async () => {
      const data = await localforage.getItem("browse-feed");
      setFeedData(data);
    };

    getFeedData();
  }, []);

  if (source === "daily") {
    return (
      <div className="p-4 flex flex-col gap-5">
        <Link
          href={`/feed?feedUrl=${getFeedItem.feedUrl}`}
          className="text-brand-primary custom-underline flex items-center gap-1 self-start"
        >
          More from this blog
        </Link>
      </div>
    );
  }

  if (!feedData) return null;

  return (
    <div className="p-4 flex flex-col gap-5">
      <h2 className="font-medium text-lg">More from this blog</h2>
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
