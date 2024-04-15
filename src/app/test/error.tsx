"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect, startTransition } from "react";

import { flushSync } from "react-dom";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const resetAndRefresh = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={resetAndRefresh}>Try again</button>
    </div>
  );
}
