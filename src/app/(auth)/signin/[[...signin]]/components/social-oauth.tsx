"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SpinnerRotate } from "@/components/spinner-rotate";

import AutocompleteHandle from "./autocomplete-handle";

export default function SocialOauth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //atproto signin
  async function handleAtProtoSignIn(e: React.SubmitEvent<HTMLFormElement>) {
    console.log("SUBMIT LOGIN BSKY");
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const handle = formData.get("handle");

    try {
      const res = await fetch("/oauth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to authorization server
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  }
  return (
    <div>
      <form onSubmit={handleAtProtoSignIn} className="space-y-4">
        <AutocompleteHandle />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="bg-brand-primary/90 hover:bg-brand-primary flex h-11 w-full cursor-pointer items-center justify-center gap-1 rounded-md text-center font-medium text-white duration-100 select-none">
          Continue {isLoading && <SpinnerRotate />}
        </button>
      </form>
    </div>
  );
}
