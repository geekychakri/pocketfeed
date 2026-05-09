import { Suspense } from "react";

import { getDid } from "@/lib/auth/session";

import SubscriptionList from "./subscription-list";

// const xata = getXataClient();

export default function SubscriptionPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionListWrapper />
    </Suspense>
  );
}

const SubscriptionListWrapper = async () => {
  const did = (await getDid()) as string;
  return <SubscriptionList did={did} />;
};
