"use client";

import { useState } from "react";
import Link, { type LinkProps } from "next/link";

import { cn } from "@/lib/utils";

export default function HoverPrefetchLink<R extends string>({
  className,
  children,
  ...props
}: LinkProps<R>) {
  const [active, setActive] = useState(false);
  return (
    <Link
      className={cn(className)}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      {...props}
    >
      {children}
    </Link>
  );
}
