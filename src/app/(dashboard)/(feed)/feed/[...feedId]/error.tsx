"use client"; // Error boundaries must be Client Components

import { useEffect, startTransition } from "react";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import NotFoundSVG from "@/components/svg/not-found";

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
    <div className="mx-auto flex h-screen w-[320px] flex-col justify-center gap-4">
      <NotFoundSVG className="w-full" />
      <h2 className="text-center text-lg">
        Something went wrong, but don&apos;t fret — it&apos;s not your fault!
      </h2>
      <div className="flex w-full flex-col gap-4">
        <Button onClick={refreshAndReset} className="flex-1">
          Try again
        </Button>
        <Button
          onClick={() => router.back()}
          className="border-shadow flex-1 bg-transparent"
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
