"use client";

import DOMPurify from "isomorphic-dompurify";

import ReactDOM from "react-dom/client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

import { useFormState } from "react-dom";

import { usePathname } from "next/navigation";

import { useParams } from "next/navigation";

import RouteBack from "../RouteBack/RouteBack";

import { Howl, Howler } from "howler";

import { motion } from "framer-motion";

import Script from "next/script";

import Modal from "../Modal/Modal";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

import { useArticles } from "@/store/articles-list";

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && node.getAttribute("href")?.startsWith("#")) {
    node.removeAttribute("target");
  }
});

const sound = new Howl({
  src: ["/sounds/copy.wav"],
  html5: true,
});

import { addPost } from "@/app/actions";
import Link from "next/link";

const CopyButton = () => (
  <button className="bg-primary rounded-md p-4">Click Me</button>
);

const initialState = {
  message: "",
};

export default function Article({
  content,
  articleUrl,
  articleSiteName,
}: {
  content: string;
  articleUrl: string;
  articleSiteName: string;
}) {
  console.log({ articleUrl });
  let isNewArticle = false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction] = useFormState(addPost, initialState);

  const pathname = usePathname();

  const articleRef = useRef(null);
  const effectRan = useRef(false);

  const { link } = useParams<{ link: string }>();
  console.log({ link });

  const { articles } = useArticles();

  console.log({ articles });

  isNewArticle = articles.every(
    (article, _) => article.link !== decodeURIComponent(link),
  ); // store article url in local storage
  console.log({ isNewArticle });
  useEffect(() => {
    useArticles.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (state?.message === "success") {
      setIsModalOpen(false);
    }
  }, [state]);

  useEffect(() => {
    if (!effectRan.current) {
      document.querySelectorAll("pre").forEach((pre) => {
        // Create wrapper, button, and message elements
        const wrapper = document.createElement("div");
        const button = document.createElement("button");
        // const message = document.createElement("div");
        // Set up the wrapper and button
        wrapper.style.position = "relative";
        button.innerHTML = svgIconCopy;
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

        // Add wrapper and button to the DOM
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(button);

        // Copy action
        button.addEventListener("click", () => {
          button.innerHTML = svgIconCheck;
          sound.play();
          navigator.clipboard
            .writeText(pre.textContent as string)
            .then(() => {
              setTimeout(() => {
                button.innerHTML = svgIconCopy;
              }, 1000);
            })
            .catch((err) => console.error("Error copying text: ", err));
        });
      });
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <img
          src="/nothing-to-read.svg"
          className="w-[320px]"
          alt="nothing-to-read-svg"
        />
        <p>Hmm, there&apos;s nothing to read!</p>
      </div>
    );
  }
  return (
    <>
      {/* <div>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal.Button asChild>
            <button className="rounded-lg border px-4 py-2">Post</button>
          </Modal.Button>
          <Modal.Content title="What's up?">
            <form
              className="flex flex-col gap-4 px-[25px] py-4"
              action={formAction}
            >
              <Textarea
                placeholder="Share something on your mind!"
                className="resize-none"
                name="post"
              />
              <input
                type="text"
                name="feedItemUrl"
                hidden
                defaultValue={decodeURIComponent(link)}
              />
              <Button>Post</Button>
            </form>
          </Modal.Content>
        </Modal>
      </div> */}

      {/* <div className="relative flex items-center">
        <RouteBack className="absolute -left-16 p-2" />
        <h1 className="flex h-14 items-center text-balance text-xl font-medium tracking-tight text-text-primary!">
          {article?.title}
        </h1>
      </div> */}
      {/* <RouteBack className="absolute -left-16 p-2" /> */}

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.8, -0.4, 0.5, 1] }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content),
        }}
        ref={articleRef}
        // className="relative text-lg leading-normal"
        className="content-visibility-auto prose text-text-primary prose-headings:text-text-primary prose-h1:text-xl prose-h1:font-medium prose-h2:font-semibold prose-a:text-text-primary prose-a:no-underline hover:prose-a:text-text-secondary hover:prose-a:transition-[color] prose-blockquote:text-text-primary prose-strong:text-text-primary prose-pre:rounded-md prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary prose-inline-code:rounded-md prose-inline-code:border prose-inline-code:border-border-non-interactive prose-inline-code:bg-background-secondary prose-inline-code:px-1 prose-inline-code:py-[2px] prose-inline-code:text-text-secondary prose-inline-code:before:hidden prose-inline-code:after:hidden text-base leading-7 break-words max-sm:leading-6"
        suppressHydrationWarning
      ></motion.article>

      {isNewArticle ? null : (
        <>
          <span className="border-border-non-interactive inline-block h-1 w-full border-t border-dotted"></span>
          <div className="inline-flex flex-col gap-3">
            {articleSiteName && (
              <p className="text-text-secondary text-lg">
                {articleSiteName}&apos;s latest articles&#58;
              </p>
            )}
            {articles
              .filter((item, _) => item.link !== articleUrl)
              .map((item, i) => (
                <Link
                  key={i}
                  href={`/read/${encodeURIComponent(item.link as string)}`}
                  className="custom-underline hover:text-text-secondary w-fit transition-[color]"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </>
      )}
    </>
  );
}

const svgIconCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M15 1.25h-4.056c-1.838 0-3.294 0-4.433.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433V16a3.75 3.75 0 0 0 3.166 3.705c.137.764.402 1.416.932 1.947c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h3.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-5.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26c-.531-.53-1.183-.795-1.947-.932A3.75 3.75 0 0 0 15 1.25m2.13 3.021A2.25 2.25 0 0 0 15 2.75h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S4.025 4.705 3.89 5.71c-.138 1.029-.14 2.383-.14 4.29v6a2.25 2.25 0 0 0 1.521 2.13c-.021-.61-.021-1.3-.021-2.075v-5.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.602-.602 1.36-.86 2.26-.981c.867-.117 1.97-.117 3.337-.117h3.11c.775 0 1.464 0 2.074.021M7.408 6.41c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h3c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v5c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103h-3c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191v-5c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399" clip-rule="evenodd"/></svg>`;
const svgIconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M18.493 6.935a.75.75 0 0 1 .072 1.058l-7.857 9a.75.75 0 0 1-1.13 0l-3.143-3.6a.75.75 0 0 1 1.13-.986l2.578 2.953l7.292-8.353a.75.75 0 0 1 1.058-.072" clip-rule="evenodd"/></svg>`;
