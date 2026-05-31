import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import RouteBack from "@/components/route-back";

import { getDid } from "@/lib/auth/session";

import AddFeed from "./components/add-feed";

export default async function Page() {
  return (
    <div className="border-dashed-x relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-7 px-4 py-18">
      <div className="flex items-center gap-2">
        <RouteBack className="absolute -left-9 max-md:static" />
        <h1 className="flex items-center gap-3 text-lg font-medium">
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
