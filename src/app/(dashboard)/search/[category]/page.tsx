import GlobalSearch from "@/components/global-search";
import SearchResults from "@/components/search-results";

import { Suspense } from "react";

import Link from "next/link";

import { SpinnerRotate } from "@/components/spinner-rotate";

export default async function Page(props: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const category = (await props.params).category;
  console.log({ category });
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  return (
    <main className="mx-auto flex min-h-[500px] w-full max-w-3xl flex-col gap-6 py-20 max-sm:px-4">
      <GlobalSearch category={category} />
      {/* <SearchResultSkeleton /> */}

      <Suspense
        key={query}
        fallback={
          <div className="flex items-center justify-center">
            <SpinnerRotate />
          </div>
        }
      >
        <SearchResults query={query} category={category} />
      </Suspense>
    </main>
  );
}
