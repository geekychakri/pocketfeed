"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

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

  // const {
  //   setArticleContent,
  //   setArticleLink,
  //   setArticleTitle,
  //   setIsArticleExtracted,
  // } = useArticleContent();

  console.log({ shouldFetch });

  // useHotkeys("E", () => {
  //   handleClick();
  // });

  const fetcher = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    return res.json();
  };

  const { data, error, trigger, isMutating } = useSWRMutation<{
    content: string;
    title: string;
    link: string;
  }>(`/api/extract-article?articleLink=${searchParams.get("link")}`, fetcher, {
    populateCache: true,
    revalidate: false,
    onSuccess(data, key, config) {
      console.log({ data });
      // setArticleContent(data?.content);
      // setArticleTitle(data?.title);
      // setArticleLink(data.link);
      // setIsArticleExtracted(true);
      // setArticleData(data?.content, data?.title, data.link, true);
      extractArticleIconRef.current?.stopAnimation();
    },

    onError() {
      extractArticleIconRef.current?.stopAnimation();
      toast.error("Unable to extract full article!");
    },
  });

  // console.log({ isValidating });

  console.log({ swrArticleData: data });

  const handleClick = () => {
    extractArticleIconRef.current?.startAnimation();
    trigger();
  };

  return (
    <CustomTooltip content={<span>Extract full article</span>}>
      <IconOnlyAction
        onClick={handleClick}
        className={`rounded-md ${isMutating ? "cursor-progress" : "cursor-pointer"}`}
        // disabled={isLoading}
        // id="main-item"
      >
        <ExtractArticleIcon size={18} ref={extractArticleIconRef} />
      </IconOnlyAction>
    </CustomTooltip>
  );
}
