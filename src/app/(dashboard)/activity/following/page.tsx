import { ErrorBoundary } from "react-error-boundary";

import FollowingPostsList from "./components/following-posts-list";

export default async function Page() {
  return (
    <ErrorBoundary
      fallback={<div className="text-danger px-4">Something went wrong!</div>}
    >
      <div className="flex flex-col pt-5 pb-20">
        <FollowingPostsList />
      </div>
    </ErrorBoundary>
  );
}
