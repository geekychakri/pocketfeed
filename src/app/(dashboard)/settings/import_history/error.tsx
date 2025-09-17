"use client"; // Error boundaries must be Client Components

import Button from "@/components/ui/custom-button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[750px] flex-col items-center gap-6 py-20">
      <p className="flex flex-col items-center gap-1 text-xl">
        <span>
          Something went wrong, but don&apos;t fret. It&apos;s not your fault.
        </span>
        <span>Let&apos;s try again.</span>
      </p>
      <Button
        className="bg-cta hover:bg-cta-hover text-white"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
