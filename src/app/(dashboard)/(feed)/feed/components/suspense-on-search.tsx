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

type SuspenseProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

export default function SuspenseOnSearchInner({
  children,
  fallback,
}: SuspenseProps) {
  const search = useSearchParams();
  const feedUrl = search.get("feedUrl") as string;
  // const pathname = usePathname();

  console.log({ search });

  // alert("hello");

  return (
    <ErrorBoundaryWrapper feedUrl={feedUrl}>
      <Suspense key={search.toString()} fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

const ErrorBoundaryWrapper = ({
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

// const Fallback = ({ error, resetErrorBoundary }) => {
//   const sp = useSearchParams();
//   const feedUrl = sp.get("feedUrl");
//   const errorLocation = useRef(feedUrl);

//   useEffect(() => {
//     if (feedUrl !== errorLocation.current) {
//       startTransition(() => {
//         // router.refresh();
//         resetErrorBoundary();
//       });
//     }
//   }, [sp]);
//   return <h1>Something went wrong</h1>;
// };

function ErrorFallback({ feedUrl }: { feedUrl: string }) {
  let message;
  const { error, resetBoundary } = useErrorBoundary();

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
  } else if (error.message === "unable to verify the first certificate") {
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
