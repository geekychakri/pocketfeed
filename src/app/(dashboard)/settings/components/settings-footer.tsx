"use client";

import { useClerk } from "@clerk/nextjs";
import Button from "@/components/ui/Button";

export default function SettingsFooter() {
  const { signOut } = useClerk();
  return (
    <div className="flex gap-4 font-medium *:flex-1 *:rounded-md *:px-4 *:py-2 *:text-[15px]">
      <Button
        onClick={() =>
          signOut({
            redirectUrl: "/",
          })
        }
      >
        Logout
      </Button>
      <Button className="border-0 bg-danger/10 text-danger">
        Delete account
      </Button>
    </div>
  );
}
