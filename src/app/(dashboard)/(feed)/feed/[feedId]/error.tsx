"use client"; // Error boundaries must be Client Components

import { useEffect, startTransition } from "react";

import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const refreshAndReset = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={refreshAndReset}>Try again</button>
      <button onClick={() => router.back()}>Go back</button>
    </div>
  );
}
