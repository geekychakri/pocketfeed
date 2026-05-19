"use client";

import { useToggleSidenav } from "@/store/toggle-sidenav";

export default function MobileNav() {
  const { setIsOpen, isOpen } = useToggleSidenav();
  console.log({ isOpen });
  return (
    <nav className="bg-background-primary sticky top-0 z-1000 hidden justify-between border p-4 max-md:flex">
      <h1>Pocket Feed</h1>
      <button onClick={setIsOpen}>Menu</button>
    </nav>
  );
}
