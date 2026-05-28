import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { getDid } from "@/lib/auth/session";

import SubscriptionList from "./subscription-list";

// const xata = getXataClient();

export default function SubscriptionPage() {
  return (
    <ErrorBoundary
      fallback={<div className="text-danger p-4">Something went wrong!</div>}
    >
      <Suspense fallback={null}>
        <SubscriptionListWrapper />
      </Suspense>
    </ErrorBoundary>
  );
}

const SubscriptionListWrapper = async () => {
  const did = (await getDid()) as string;
  return <SubscriptionList did={did} />;
};
