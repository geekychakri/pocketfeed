"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function RouteBack({ text }: { text?: string }) {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="flex items-center gap-1">
      <ArrowLeftIcon className="size-4" />
      <span className="opacity-80">{text}</span>
    </button>
  );
}
