"use client";

import Link from "next/link";

import { ComponentType, ReactNode, useState } from "react";

export default function NavigationItem({
  to,
  children,
  Icon,
}: {
  to: string;
  children: ReactNode;
  Icon: ComponentType;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={to}>
      <div
        className="flex items-center"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <Icon data-hovered={hovered} />
        {children}
      </div>
    </Link>
  );
}
