"use client";

import { useState } from "react";

// import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

type LogoutResponse = {
  success: boolean;
};

export default function SettingsFooter() {
  // const router = useRouter();

  // const clearCache = () => mutate(() => true, undefined, { revalidate: false });

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const res = await fetch("/oauth/logout", { method: "POST" });
      const data: LogoutResponse = await res.json();
      if (data.success) {
        // clearCache();
        // router.replace("/");
        window.location.replace("/");
      } else {
        throw new Error("");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 font-medium">
      <h2 className="text-brand-primary">Sign out of your account</h2>
      <Button
        onClick={(e) => {
          handleLogout();
        }}
        className="flex items-center justify-center gap-1"
      >
        Sign out {isLoading && <SpinnerRotate />}
      </Button>
      {/*<Button className="bg-danger/10 text-danger border-0">
        Delete account
      </Button>*/}
    </div>
  );
}
