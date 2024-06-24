"use client";
import { useClerk } from "@clerk/nextjs";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";

const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <DropdownMenu.Item
      className="relative flex h-[25px] select-none items-center gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-[#555] outline-none duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:text-mauve8 data-[highlighted]:text-black"
      onClick={() => signOut({ redirectUrl: "/" })}
    >
      <span>
        <ExitIcon />
      </span>
      <span>Sign out</span>
    </DropdownMenu.Item>
  );
};

export default SignOutButton;
