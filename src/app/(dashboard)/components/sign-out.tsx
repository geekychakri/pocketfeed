"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { LogoutIcon } from "@/icons/animated/logout-icon";

type UserIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};
type LogoutResponse = {
  success: boolean;
};
const SignOutButton = () => {
  const router = useRouter();

  // const clearCache = () => mutate(() => true, undefined, { revalidate: false });

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const res = await fetch("/oauth/logout", { method: "POST" });
      const data: LogoutResponse = await res.json();
      if (data.success) {
        // clearCache();
        router.replace("/");
      } else {
        throw new Error("");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
      <span className="flex items-center gap-1">
        Sign out {isLoading && <SpinnerRotate />}
      </span>
      <span>
        <LogoutIcon ref={iconRef} />
      </span>
    </DropdownMenu.Item>
  );
};

export default SignOutButton;
