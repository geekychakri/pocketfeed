"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { useHotkeys } from "react-hotkeys-hook";
import useSWR, { useSWRConfig } from "swr";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

import {
  ExtractArticleIcon,
  ExtractArticleIconHandle,
} from "@/icons/animated/extract-article-icon";
import { fetcher } from "@/lib/utils";
import { useArticleContent } from "@/store/article-content";

export default function ExtractArticle() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const extractArticleIconRef = useRef<ExtractArticleIconHandle>(null);

  // const params = useParams<{ link: string }>();

  const searchParams = useSearchParams();

  const {
    setArticleContent,
    setArticleLink,
    setArticleTitle,
    setIsArticleExtracted,
  } = useArticleContent();

  console.log({ shouldFetch });

  const { cache } = useSWRConfig();

  // useHotkeys("E", () => {
  //   handleClick();
  // });

  const { data, error, isValidating, mutate } = useSWR<{
    content: string;
    title: string;
    link: string;
  }>(
    shouldFetch
      ? `/api/extract-article?articleLink=${searchParams.get("link")}`
      : null,
    fetcher,
    {
      // keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      // revalidateOnMount: false, //TODO: doesn't fetch on initial render
      onSuccess(data, key, config) {
        console.log({ data });
        setArticleContent(data?.content);
        setArticleTitle(data?.title);
        setArticleLink(data.link);
        setIsArticleExtracted(true);
        // setArticleData(data?.content, data?.title, data.link, true);
        extractArticleIconRef.current?.stopAnimation();
      },
    },
  );

  console.log({ isValidating });

  console.log({ swrArticleData: data });

  const handleClick = () => {
    // console.log({ data });
    if (!data) {
      extractArticleIconRef.current?.startAnimation();
      setShouldFetch(true);
      // mutate();
    }
    // if (!shouldFetch) {
    //   setShouldFetch(true);
    //   extractArticleIconRef.current?.startAnimation();
    // }
    // if (data) {
    //   console.log("RAN CACHE");
    //   setArticleData(data?.content, data?.title, true);
    //   // extractArticleIconRef.current?.stopAnimation();
    // }
  };

  // console.log({ isLoading });
  // console.log({ data });

  // useEffect(() => {
  //   console.log("HELLO");
  //   if (!data && shouldFetch) mutate();
  //   if (data) {
  //     console.log("RAN CACHE");
  //     setArticleData(data?.content, data?.title, true);
  //     extractArticleIconRef.current?.stopAnimation();
  //   }
  // }, [shouldFetch, data, mutate]);

  return (
    <CustomTooltip content={<span>Extract full article</span>}>
      <IconOnlyAction
        onClick={handleClick}
        className={`rounded-md ${isValidating ? "cursor-progress" : "cursor-pointer"}`}
        // disabled={isValidating}
        // id="main-item"
      >
        <ExtractArticleIcon size={18} ref={extractArticleIconRef} />
      </IconOnlyAction>
      {/*<form
        id="extract-article"
        className="relative flex rounded-md size-6 cursor-pointer items-center justify-center px-5 py-5 hover:bg-ui-hover transition-[background-color] duration-150"
      >
        <ExtractArticleIcon size={18} ref={extractArticleIconRef} />
      </form>*/}
    </CustomTooltip>
  );
}
