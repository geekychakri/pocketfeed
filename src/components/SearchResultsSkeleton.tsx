"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SearchResultSkeleton() {
  return (
    <SkeletonTheme baseColor="#fff" highlightColor="#f5f5f5">
      <Skeleton
        count={10}
        height={60}
        className="border"
        containerClassName="flex flex-col" //TODO:
      />
    </SkeletonTheme>
  );
}
