"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { LogoutIcon } from "@/icons/animated/LogoutIcon";

interface UserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const SignOutButton = () => {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/oauth/logout", { method: "POST" });
    router.push("/");
  }

  const iconRef = useRef<UserIconHandle>(null);

  return (
    <DropdownMenu.Item
      className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-6.25 cursor-pointer items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none select-none focus-visible:outline-none! data-disabled:pointer-events-none"
      onSelect={(e) => {
        e.preventDefault();

        handleLogout();
      }}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <span>Sign out</span>
      <span>
        <LogoutIcon ref={iconRef} />
      </span>
    </DropdownMenu.Item>
  );
};

export default SignOutButton;
