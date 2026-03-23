"use client";

import dynamic from "next/dynamic";

const SidebarNavigation = dynamic(() => import("@/components/sidebar-nav"), {
  ssr: false,
  loading: () => <div className="w-[240px]">loading...</div>,
});

export default function SidebarWrapper() {
  return <SidebarNavigation />;
}
