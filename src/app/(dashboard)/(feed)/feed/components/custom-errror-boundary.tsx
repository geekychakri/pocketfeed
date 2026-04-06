"use client";

import { startTransition } from "react";
import { unstable_catchError as catchError, type ErrorInfo } from "next/error";
import { useRouter } from "next/navigation";

function ErrorFallback(
  props: { title?: string },
  { error, unstable_retry: retry, reset }: ErrorInfo,
) {
  const router = useRouter();
  return (
    <div>
      <p>Something went wrong</p>
      <button
        onClick={() => {
          startTransition(() => {
            reset();
            router.back();
          });
        }}
      >
        Try again
      </button>
    </div>
  );
}

const ErrorWrapper = catchError(ErrorFallback);

export default ErrorWrapper;
