"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";

import { LogoutIcon } from "@/icons/animated/LogoutIcon";
import { UserIcon } from "@/icons/animated/UserIcon";

interface UserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const SignOutButton = () => {
  // const [hovered, setHovered] = useState(false);
  // const { signOut } = useClerk();
  //
  const router = useRouter();

  async function handleLogout() {
    await fetch("/oauth/logout", { method: "POST" });
    router.push("/");
  }

  const iconRef = useRef<UserIconHandle>(null);

  return (
    <DropdownMenu.Item
      className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-[25px] cursor-pointer items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none focus-visible:outline-none! select-none data-disabled:pointer-events-none"
      // onClick={() => signOut({ redirectUrl: "/" })}
      onSelect={(e) => {
        e.preventDefault();
        // signOut({ redirectUrl: "/" });
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
