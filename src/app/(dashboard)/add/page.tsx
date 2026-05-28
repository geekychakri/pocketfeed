import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import RouteBack from "@/components/route-back";

import { getDid } from "@/lib/auth/session";

import AddFeed from "./components/add-feed";

export default async function Page() {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-7 py-18">
      <div className="">
        <RouteBack className="absolute -left-9" />
        <h1 className="flex items-center gap-3 text-xl font-medium">
          <span>Add feed</span>
        </h1>
      </div>
      <ErrorBoundary
        fallback={<div className="text-danger p-4">Something went wrong!</div>}
      >
        <Suspense fallback={null}>
          <AddFeedWrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

const AddFeedWrapper = async () => {
  const did = (await getDid()) as string;

  return <AddFeed did={did} />;
};
