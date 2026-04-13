import { Suspense } from "react";
import Link from "next/link";

import GlobalSearch from "@/components/global-search";
import SearchResults from "@/components/search-results";
import { SpinnerRotate } from "@/components/spinner-rotate";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    query?: string;
  }>;
}) {
  // const category = (await props.params).category;
  // console.log({ category });
  // const paramsPromise = props.params;
  // const searchParams = await props.searchParams;
  // const query = searchParams?.query || "";

  const categoryParamPromise = params.then((p) => ({ category: p.category }));
  const searchQueryPromise = searchParams.then((sp) => ({ query: sp.query }));
  return (
    <main
      id="main"
      className="mx-auto flex min-h-screen border-x w-full max-w-3xl flex-col gap-6 py-14 max-sm:px-4"
    >
      <Suspense>
        <GlobalSearchWrapper
          categoryParamPromise={categoryParamPromise}
          searchQueryPromise={searchQueryPromise}
        ></GlobalSearchWrapper>
      </Suspense>
      {/* <SearchResultSkeleton /> */}

      {/*<Suspense
        key={query}
        fallback={
          <div className="flex items-center justify-center">
            <SpinnerRotate />
          </div>
        }
      >
        <SearchResults query={query} category={category} />
      </Suspense>*/}
    </main>
  );
}

const GlobalSearchWrapper = async ({
  categoryParamPromise,
  searchQueryPromise,
}: {
  categoryParamPromise: any;
  searchQueryPromise: any;
}) => {
  const { category } = await categoryParamPromise;

  const { query } = await searchQueryPromise;

  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Query: {query}</h2>
      <GlobalSearch category={category} />
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
    </div>
  );
};
