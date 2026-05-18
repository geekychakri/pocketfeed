"use client";

import Button from "@/components/ui/custom-button";

export default function SettingsFooter() {
  // const { signOut } = useClerk();
  return (
    <div className="flex gap-4 font-medium *:flex-1 *:rounded-md *:px-4 *:py-2 *:text-[15px]">
      <Button
        onClick={() =>
          // signOut({
          //   redirectUrl: "/",
          // })
          console.log("SIGN OUT")
        }
      >
        Logout
      </Button>
      <Button className="bg-danger/10 text-danger border-0">
        Delete account
      </Button>
    </div>
  );
}
