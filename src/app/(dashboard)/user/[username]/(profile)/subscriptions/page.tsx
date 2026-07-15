import { ErrorBoundary } from "react-error-boundary";

import getSession from "@/lib/iron-session/get-iron-session";

import SubscriptionList from "./subscription-list";

export default async function SubscriptionPage() {
  const session = getSession();

  return (
    <ErrorBoundary
      fallback={<div className="text-danger p-4">Something went wrong!</div>}
    >
      {session.then(({ user }) => (
        <>
          <SubscriptionList
            loggedInHandle={user?.handle as string}
            loggedInDid={user?.did as string}
          />
        </>
      ))}
    </ErrorBoundary>
  );
}
