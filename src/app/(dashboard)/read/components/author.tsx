"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import localforage from "localforage";

import RouteBack from "@/components/route-back";

export default function Author() {
  const [feedData, setFeedData] = useState();

  const searchParams = useSearchParams();

  const author = searchParams.get("author");

  const source = searchParams.get("source");

  const getFeedItem = JSON.parse(localStorage.getItem("feedItem") as string);

  useEffect(() => {
    const getReadList = async () => {
      const data = await localforage.getItem("browse-feed");
      setFeedData(data);
    };

    getReadList();
  }, []);

  if (source === "daily") {
    return (
      <div className="flex items-center gap-4 relative">
        <RouteBack className="absolute -left-12 cursor-pointer" />
        <Link
          href={`/daily`}
          className="text-brand-primary hover:text-text-primary transition-[color] font-medium"
        >
          Back to daily | {getFeedItem.feedTitle}
        </Link>
      </div>
    );
  }

  if (!feedData)
    return (
      <div className="animate-pulse">
        <div className="h-8 w-36 flex items-center">
          <div className="rounded bg-ui-normal h-full w-full"></div>
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-4 relative">
      <RouteBack className="absolute -left-12 cursor-pointer" />
      <Link
        href={`/feed?feedUrl=${feedData.feedUrl}`}
        className="text-brand-primary hover:text-text-primary transition-[color] font-medium"
      >
        {feedData.title}
      </Link>
    </div>
  );
}
