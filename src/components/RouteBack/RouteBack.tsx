"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function RouteBack() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      <ArrowLeftIcon className="h-5 w-5" />
    </button>
  );
}
