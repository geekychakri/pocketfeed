"use client";

import { ComponentType, ReactNode, useState } from "react";
import Link from "next/link";

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
