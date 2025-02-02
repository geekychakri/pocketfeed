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
      className={cn("flex items-center gap-1", className)}
    >
      <ArrowLeftIcon className="size-4" />
      <span className="opacity-80">{text}</span>
    </button>
  );
}
