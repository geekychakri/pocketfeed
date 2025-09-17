"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

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

  const params = useParams<{ link: string }>();

  const { setArticleData } = useArticleContent();

  console.log({ shouldFetch });

  const { cache } = useSWRConfig();

  useHotkeys("E", () => {
    handleClick();
  });

  const { data, error, isLoading, mutate } = useSWR<{
    content: string;
    title: string;
  }>(`/api/extractArticle?articleLink=${params.link}`, fetcher, {
    keepPreviousData: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    revalidateOnMount: false, //TODO:
    onSuccess(data, key, config) {
      console.log({ data });
      setArticleData(data?.content, data?.title, true);
      extractArticleIconRef.current?.stopAnimation();
    },
  });

  console.log({ data });

  const handleClick = useCallback(() => {
    // console.log({ data });
    if (!data) {
      // setShouldFetch(true);
      extractArticleIconRef.current?.startAnimation();
      mutate();
    }
    // if (!shouldFetch) {
    //   setShouldFetch(true);
    //   extractArticleIconRef.current?.startAnimation();
    // }
    if (data) {
      console.log("RAN CACHE");
      setArticleData(data?.content, data?.title, true);
      // extractArticleIconRef.current?.stopAnimation();
    }
  }, [data]);

  console.log({ isLoading });
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
    <CustomTooltip
      content={
        <span>
          Extract full article <kbd>[E]</kbd>
        </span>
      }
    >
      <IconOnlyAction
        onClick={handleClick}
        className={isLoading ? "cursor-progress" : "cursor-pointer"}
        disabled={isLoading}
      >
        <ExtractArticleIcon size={18} ref={extractArticleIconRef} />
      </IconOnlyAction>
    </CustomTooltip>
  );
}
