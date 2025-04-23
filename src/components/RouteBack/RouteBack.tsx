"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

export default function RouteBack({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "relative flex size-6 items-center justify-center gap-3",
        className,
      )}
    >
      {!text && (
        <span className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"></span>
      )}
      <ArrowLeftIcon className="size-4" />
      {text && <span className="opacity-80">{text}</span>}
    </button>
  );
}
