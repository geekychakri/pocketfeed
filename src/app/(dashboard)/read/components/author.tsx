"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import RouteBack from "@/components/route-back";

export default function Author() {
  const searchParams = useSearchParams();

  const source = searchParams.get("source");

  const getFeedItem = JSON.parse(localStorage.getItem("feedItem") as string);

  console.log({ getFeedItem });

  if (source === "daily") {
    return (
      <div className="relative flex items-center gap-4">
        <RouteBack className="absolute -left-12 cursor-pointer max-md:static" />
        <Link
          href={`/daily`}
          className="text-brand-primary hover:text-text-primary font-medium transition-[color]"
        >
          Back to daily | {new URL(getFeedItem.link).hostname}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-4">
      <RouteBack className="absolute -left-12 cursor-pointer max-md:static" />
      {new URL(getFeedItem.link).hostname}
    </div>
  );
}
