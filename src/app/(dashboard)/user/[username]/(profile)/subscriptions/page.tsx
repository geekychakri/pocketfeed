import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import getSession from "@/lib/iron-session/get-iron-session";

import SubscriptionList from "./subscription-list";

export default async function SubscriptionPage() {
  const session = getSession();

  return (
    <ErrorBoundary
      fallback={<div className="text-danger p-4">Something went wrong!</div>}
    >
      <Suspense fallback={<LoadingSkeleton />}>
        {session.then(({ user }) => (
          <>
            <SubscriptionList
              loggedInHandle={user?.handle as string}
              loggedInDid={user?.did as string}
            />
          </>
        ))}
      </Suspense>
    </ErrorBoundary>
  );
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-8 p-4">
    {Array.from({ length: 50 }, (_, i) => {
      return (
        <div
          key={i}
          className="bg-skeleton-highlight flex h-8 w-full animate-pulse flex-col gap-4 rounded-md px-4"
        ></div>
      );
    })}
  </div>
);
