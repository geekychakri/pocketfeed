"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";

import { LogoutIcon } from "@/icons/animated/LogoutIcon";

const SignOutButton = () => {
  const [hovered, setHovered] = useState(false);
  const { signOut } = useClerk();

  return (
    <DropdownMenu.Item
      className="relative flex h-[25px] cursor-pointer select-none items-center gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-text-primary outline-none duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-normal data-[disabled]:text-mauve8"
      // onClick={() => signOut({ redirectUrl: "/" })}
      onSelect={(e) => {
        e.preventDefault();
        signOut({ redirectUrl: "/" });
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <span>
        <LogoutIcon data-hovered={hovered} />
      </span>
      <span>Sign out</span>
    </DropdownMenu.Item>
  );
};

export default SignOutButton;
