import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";

import getSession from "@/lib/iron-session/get-iron-session";

import DiscoverPostsList from "./components/discover-posts-list";

export default async function Page() {
  const currentUserPromise = getSession().then((session) => ({
    did: session.user?.did,
    handle: session.user?.handle,
    displayName: session.user?.displayName,
    avatar: session.user?.avatar,
  }));
  return (
    <ErrorBoundary
      fallback={<div className="text-danger px-4">Something went wrong!</div>}
    >
      <div className="flex flex-col pt-5 pb-20">
        <SWRConfig
          value={{
            fallback: {
              currentUser: currentUserPromise,
            },
          }}
        >
          <DiscoverPostsList />
        </SWRConfig>
      </div>
    </ErrorBoundary>
  );
}
