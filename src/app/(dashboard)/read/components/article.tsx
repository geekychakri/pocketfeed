"use client";

import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import nord from "@shikijs/themes/nord";
import { decode } from "html-entities";
import DOMPurify from "isomorphic-dompurify";
import { animate } from "motion/mini";
import { motion } from "motion/react";
import { useFormState } from "react-dom";
import ReactDOM from "react-dom/client";
import { createHighlighter } from "shiki";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import useSound from "use-sound";

import Modal from "@/components/custom-modal";
import RouteBack from "@/components/route-back";
import { SpinnerRotate } from "@/components/spinner-rotate";
import NothingToReadSVG from "@/components/svg/nothing-to-read";
import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import { addPost } from "@/app/actions/add-post";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, internalErrorToast } from "@/lib/utils";
import { useArticleContent } from "@/store/article-content";
import { useArticles } from "@/store/articles-list";

// function makeRelativeUrl(url, origin) {
//   try {
//     const absoluteUrl = new URL(url);
//     if (absoluteUrl.origin === origin) {
//       return absoluteUrl.pathname + absoluteUrl.search + absoluteUrl.hash;
//     }
//   } catch (error) {
//     // Invalid URL, return null to keep original
//   }
//   return null;
// }

DOMPurify.addHook("afterSanitizeElements", function (node) {
  // if (node.tagName === "IMG" && node.src) {
  //   node.src = `https://jakearchibald.com/${node.src}`;
  // }
  // // Handle links
  // if (node.tagName === "A" && node.href) {
  //  node.href = `https://jakearchibald.com/${node.}`;
  // }
  // Handle other elements with src
  // if (["AUDIO", "VIDEO", "SOURCE"].includes(node.tagName) && node.src) {
  //   node.src = `https://jakearchibald.com/${node.src}`;
  // }
});

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && node.getAttribute("href")?.startsWith("#")) {
    node.removeAttribute("target");
  }

  if (node.tagName === "A" && !node.hasAttribute("target")) {
    node.setAttribute("target", "_blank");
  }

  // if (node.tagName === "PRE") {
  //   // document.querySelectorAll("pre").forEach((pre) => {
  //   // Create wrapper, button, and message elements
  //   const wrapper = document.createElement("div");
  //   const button = document.createElement("button");
  //   // const message = document.createElement("div");
  //   // Set up the wrapper and button
  //   wrapper.style.position = "relative";
  //   button.innerHTML = svgIconCopy;
  //   // button.style.position = "absolute";
  //   // button.style.width = "32px";
  //   // button.style.height = "32px";
  //   // button.style.top = "0";
  //   // button.style.right = "0";
  //   // button.style.display = "flex";
  //   // button.style.alignItems = "center";
  //   // button.style.justifyContent = "center";
  //   // button.style.margin = "-17px 10px";
  //   // button.style.background = "#fff";
  //   // button.style.border = "1px solid #d1d5db";
  //   // button.style.borderRadius = "6px";
  //   button.className = "copy-code-btn";
  //   // button.style.color = "#2F2F2F";
  //   // button.style.padding = "5px 12px";

  //   // Add wrapper and button to the DOM
  //   node.parentNode?.insertBefore(wrapper, node);
  //   wrapper.appendChild(node);
  //   wrapper.appendChild(button);

  //   // Copy action
  //   button.addEventListener("click", () => {
  //     button.innerHTML = svgIconCheck;
  //     // copySound();
  //     navigator.clipboard
  //       .writeText(node.textContent as string)
  //       .then(() => {
  //         setTimeout(() => {
  //           button.innerHTML = svgIconCopy;
  //         }, 1000);
  //       })
  //       .catch((err) => console.error("Error copying text: ", err));
  //   });
  //   // });
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
    // if (el.hasAttribute("href")) {
    //   const href = el.getAttribute("href");
    //   if (!href.includes(baseUrl)) {
    //     try {
    //       el.setAttribute("href", new URL(href, baseUrl).href);
    //     } catch (_) {}
    //   }
    // }

    // if (el.hasAttribute("srcset")) {
    //   const srcset = el.getAttribute("srcset");
    //   // try {
    //   //   el.setAttribute("srcset", new URL(src, baseUrl).href);
    //   // } catch (_) {}
    //   if (!srcset?.includes(baseUrl)) {
    //     try {
    //       el.setAttribute("srcset", new URL(srcset as string, baseUrl).href);
    //     } catch (_) {}
    //   }
    // }

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
  const [feedItem, _] = useState(() => {
    return localStorage.getItem("feedItem")
      ? JSON.parse(localStorage.getItem("feedItem") as string)
      : null;
  });
  console.log({ articleUrl });
  let isNewArticle = false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fetchArticle, setFetchArticle] = useState(false);

  const [state, formAction] = useActionState(addPost, initialState);

  const pathname = usePathname();

  const [copySound] = useSound("/sounds/copy.wav");

  console.log({ pathname });

  const articleRef = useRef(null);
  const effectRan = useRef(false);

  const { articleContent, articleTitle, isExtracted } = useArticleContent();

  const { onError } = useSWRConfig();

  // If someone deletes localstorage by mistake
  const { data, error, isLoading } = useSWR<{
    content: string;
    title: string;
    author: string;
    source: string;
  }>(
    feedItem ? null : `/api/extractArticle?articleLink=${articleUrl}`,
    fetcher,
    {
      keepPreviousData: true,
      // revalidateIfStale: true,
      // revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error, key) => {
        if (error.status === 500) {
          internalErrorToast(INTERNAL_ERROR_MESSAGE);
        }
      },
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 500) return;

        // Only retry up to 5 times.
        if (retryCount >= 5) return;
      },
    },
  );

  // console.log(data?.content);

  const { link } = useParams<{ link: string }>();
  console.log({ link });
  const articleLinkOrigin = new URL(decodeURIComponent(link)).origin;

  // const { articles } = useArticles();

  console.log({ articleContent });

  const searchParams = useSearchParams();

  const blogName = searchParams.get("author");

  console.log({ data });

  // console.log({ articles });

  // isNewArticle = articles.every(
  //   (article, _) => article.link !== decodeURIComponent(link),
  // ); // store article url in local storage
  // console.log({ isNewArticle });
  // useEffect(() => {
  //   useArticles.persist.rehydrate();
  // }, []);

  let contentToRead: string;

  if (isExtracted) {
    contentToRead = articleContent;
  } else {
    contentToRead = feedItem
      ? convertRelativeUrlsToAbsolute(feedItem.content, articleLinkOrigin)
      : (data?.content as string);
  }

  useEffect(() => {
    // if (!effectRan.current) {
    console.log("select code ran");
    document.querySelectorAll("pre").forEach((pre) => {
      // Create wrapper, button, and message elements
      const wrapper = document.createElement("div");
      const button = document.createElement("button");
      // const popoverEle = document.createElement("div");
      // popoverEle.id = "poppy";
      // popoverEle.setAttribute("popover", "hint");
      // popoverEle.innerText = "Copy code";

      // const message = document.createElement("div");
      // Set up the wrapper and button
      wrapper.style.position = "relative";
      button.innerHTML = svgIconCopy;
      button.style.cursor = "pointer";
      // button.style.position = "absolute";
      // button.style.width = "32px";
      // button.style.height = "32px";
      // button.style.top = "0";
      // button.style.right = "0";
      // button.style.display = "flex";
      // button.style.alignItems = "center";
      // button.style.justifyContent = "center";
      // button.style.margin = "-17px 10px";
      // button.style.background = "#fff";
      // button.style.border = "1px solid #d1d5db";
      // button.style.borderRadius = "6px";
      button.className = "copy-code-btn";
      // button.style.color = "#2F2F2F";
      // button.style.padding = "5px 12px";

      //popover Ele

      // Add wrapper and button to the DOM
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(button);
      // wrapper.appendChild(popoverEle);

      animate("#svgIconCopy", { opacity: 1 }, { duration: 0.5 });

      // const popover = document.getElementById("poppy") as HTMLDivElement;

      // button.onmouseenter = () => {
      //   setTimeout(() => {
      //     popover.showPopover();
      //   }, 500);
      // };

      // button.onmouseleave = () => {
      //   setTimeout(() => {
      //     popover.hidePopover();
      //   }, 500);
      // };

      // Copy action
      button.addEventListener("click", () => {
        button.disabled = true;
        button.innerHTML = svgIconCheck;
        animate("#svgIconCheck", { opacity: 1 }, { duration: 0.5 });
        copySound();
        navigator.clipboard
          .writeText(pre.textContent as string)
          .then(() => {
            setTimeout(() => {
              button.innerHTML = svgIconCopy;
              button.disabled = false;
              animate("#svgIconCopy", { opacity: 1 }, { duration: 0.5 });
            }, 3000);
          })
          .catch((err) => console.error("Error copying text: ", err));
      });
    });
    // }

    // return () => {
    //   effectRan.current = true;
    // };
  }, [copySound, isExtracted]);

  if (error) {
    throw new Error("Something went wrong!"); //TODO: Catch nearest error boundary
  }

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

  if (data?.content === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <NothingToReadSVG className="w-[320px]" />
        <p>Hmm, there&apos;s nothing to read!</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <SpinnerRotate />
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-12 flex flex-col gap-2 pt-[10px]">
        {/* <RouteBack className="absolute -left-9 p-2" /> */}
        <h1 className="flex min-h-14 items-center gap-2 text-[48px] leading-[52px] font-[575] tracking-tighter text-balance">
          {decode(feedItem?.title) || decode(data?.title)}
        </h1>
        {!blogName ? (
          <span className="text-text-secondary">{feedItem?.author}</span>
        ) : null}
      </div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.8, -0.4, 0.5, 1] }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(contentToRead, {
            FORBID_TAGS: ["style"],
            FORBID_ATTR: ["style"],
          }),
        }}
        ref={articleRef}
        // className="relative text-lg leading-normal"
        className="content-visibility-auto prose prose-a:hover:text-text-secondary prose-a:hover:transition-[color] text-text-primary prose-headings:text-text-primary prose-h1:text-base prose-h1:font-medium prose-headings:text-[24px] prose-headings:font-medium prose-headings:leading-8 prose-headings:tracking-tight prose-a:text-text-primary prose-a:no-underline prose-blockquote:text-text-primary prose-strong:text-text-primary prose-pre:rounded-md prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary prose-pre:select-all prose-inline-code:rounded-md prose-inline-code:border prose-inline-code:border-border-non-interactive prose-inline-code:bg-background-secondary prose-inline-code:px-1 prose-inline-code:py-[2px] prose-inline-code:text-text-secondary prose-inline-code:before:hidden prose-inline-code:after:hidden text-base leading-7 break-words max-sm:leading-6"
        suppressHydrationWarning
      ></motion.article>

      {/* {isNewArticle ? null : (
        <>
          <span className="border-border-non-interactive inline-block h-1 w-full border-t border-dotted"></span>
          <div className="inline-flex flex-col gap-3">
            {articleSiteName && (
              <p className="text-text-secondary text-lg">
                {articleSiteName}&apos;s latest articles&#58;
              </p>
            )}
          </div>
        </>
      )} */}
    </>
  );
}

const svgIconCopy = `<svg xmlns="http://www.w3.org/2000/svg" id="svgIconCopy" opacity="0"  width="18" height="18" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M15 1.25h-4.056c-1.838 0-3.294 0-4.433.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433V16a3.75 3.75 0 0 0 3.166 3.705c.137.764.402 1.416.932 1.947c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h3.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-5.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26c-.531-.53-1.183-.795-1.947-.932A3.75 3.75 0 0 0 15 1.25m2.13 3.021A2.25 2.25 0 0 0 15 2.75h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S4.025 4.705 3.89 5.71c-.138 1.029-.14 2.383-.14 4.29v6a2.25 2.25 0 0 0 1.521 2.13c-.021-.61-.021-1.3-.021-2.075v-5.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.602-.602 1.36-.86 2.26-.981c.867-.117 1.97-.117 3.337-.117h3.11c.775 0 1.464 0 2.074.021M7.408 6.41c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h3c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v5c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103h-3c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191v-5c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399" clip-rule="evenodd"/></svg>`;
const svgIconCheck = `<svg xmlns="http://www.w3.org/2000/svg" opacity="0" id="svgIconCheck" width="18" height="18" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M18.493 6.935a.75.75 0 0 1 .072 1.058l-7.857 9a.75.75 0 0 1-1.13 0l-3.143-3.6a.75.75 0 0 1 1.13-.986l2.578 2.953l7.292-8.353a.75.75 0 0 1 1.058-.072" clip-rule="evenodd"/></svg>`;

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
