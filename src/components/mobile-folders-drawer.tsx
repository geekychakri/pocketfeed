"use client";

import * as React from "react";

import { Drawer } from "@base-ui/react/drawer";
import { ScrollArea } from "@base-ui/react/scroll-area";

const ITEMS = [
  { href: "#", label: "Add Feed" },
  { href: "#", label: "Daily" },
  { href: "#", label: "Activity" },
  { href: "#", label: "Read it later" },
] as const;

const LONG_LIST = Array.from({ length: 50 }, (_, i) => ({
  href: "#",
  label: `Item ${i + 1}`,
}));

export default function MobileFolderDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useLayoutEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Drawer.Root>
  );
}
