"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SearchResultSkeleton() {
  return (
    <SkeletonTheme>
      <Skeleton
        count={10}
        height={60}
        className="border"
        containerClassName="flex flex-col bg-yellow-200" //TODO:
      />
    </SkeletonTheme>
  );
}
