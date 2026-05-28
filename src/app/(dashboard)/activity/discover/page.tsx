import { ErrorBoundary } from "react-error-boundary";

import DiscoverPostsList from "./components/discover-posts-list";

export default async function Page() {
  return (
    <ErrorBoundary
      fallback={<div className="text-danger px-4">Something went wrong!</div>}
    >
      <div className="flex flex-col pt-5 pb-20">
        <DiscoverPostsList />
      </div>
    </ErrorBoundary>
  );
}
