"use client";

import {
  startTransition,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ErrorBoundary,
  getErrorMessage,
  useErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

const CustomErrorBoundary = ({
  children,
  feedUrl,
}: {
  children: React.ReactNode;
  feedUrl: string;
}) => {
  return (
    <ErrorBoundary
      // resetKeys={[search.toString(), pathname.toString()]}
      // FallbackComponent={Fallback}
      fallback={<ErrorFallback feedUrl={feedUrl} />}
    >
      {children}
    </ErrorBoundary>
  );
};

// };

function ErrorFallback({ feedUrl }: { feedUrl: string }) {
  let message;
  const { error, resetBoundary } = useErrorBoundary();

  console.log({ error });

  const searchParams = useSearchParams();
  const currentFeedUrl = searchParams.get("feedUrl");

  const feedUrlRef = useRef(currentFeedUrl);

  useEffect(() => {
    if (currentFeedUrl !== feedUrlRef.current) {
      startTransition(() => {
        resetBoundary();
      });
    }
  }, [searchParams, currentFeedUrl, resetBoundary]);

  if (feedUrl.includes("youtube.com")) {
    message =
      "Looks like YouTube feeds are temporarily unavailable. Please check back shortly.";
  } else if (error?.info?.message.includes("unable")) {
    message = "Unable to access this feed.";
  } else {
    message = "Something went wrong but don't fret — it's not your fault.";
  }
  return (
    <div className="p-4">
      <p>{message}</p>
      <div>
        <p>Explore other feeds</p>
      </div>
    </div>
  );
}

export default CustomErrorBoundary;
