import { SVGProps, useState } from "react";
import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { motion } from "motion/react";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

export default function SocialOauth() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const { signIn, isLoaded } = useSignIn();

  // if (!isLoaded)
  //   return (
  //     <div className="flex h-28 items-center justify-center">
  //       <SpinnerRotate />
  //     </div>
  //   );

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/folder/Home",
      })
      .then((res) => {
        console.log({ signUpRes: res });
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  //atproto signin
  async function handleAtProtoSignIn(e: React.FormEvent) {
    console.log("SUBMIT LOGIN BSKY");
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setLoading(false);
    }
  }
  return (
    <div
      className={`flex h-28 w-full max-w-96 flex-col gap-4`}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
    >
      <form onSubmit={handleAtProtoSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="alice.bsky.social"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !handle}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login to the Atmosphere"}
        </button>
      </form>

      <LogoutButton />
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/oauth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm cursor-pointer border px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      Sign out
    </button>
  );
}

function LineMdGithubLoop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <mask id="lineMdGithubLoop0" width="24" height="24" x="0" y="0">
        <g fill="#fff">
          <ellipse cx="9.5" cy="9" rx="1.5" ry="1"></ellipse>
          <ellipse cx="14.5" cy="9" rx="1.5" ry="1"></ellipse>
        </g>
      </mask>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          strokeDasharray="32"
          strokeDashoffset="32"
          d="M12 4c1.67 0 2.61 0.4 3 0.5c0.53 -0.43 1.94 -1.5 3.5 -1.5c0.34 1 0.29 2.22 0 3c0.75 1 1 2 1 3.5c0 2.19 -0.48 3.58 -1.5 4.5c-1.02 0.92 -2.11 1.37 -3.5 1.5c0.65 0.54 0.5 1.87 0.5 2.5c0 0.73 0 3 0 3M12 4c-1.67 0 -2.61 0.4 -3 0.5c-0.53 -0.43 -1.94 -1.5 -3.5 -1.5c-0.34 1 -0.29 2.22 0 3c-0.75 1 -1 2 -1 3.5c0 2.19 0.48 3.58 1.5 4.5c1.02 0.92 2.11 1.37 3.5 1.5c-0.65 0.54 -0.5 1.87 -0.5 2.5c0 0.73 0 3 0 3"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.7s"
            values="32;0"
          ></animate>
        </path>
        <path
          strokeDasharray="10"
          strokeDashoffset="10"
          d="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"
          ></animate>
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.8s"
            dur="0.2s"
            values="10;0"
          ></animate>
        </path>
      </g>
      <rect
        width="8"
        height="4"
        x="8"
        y="11"
        fill="currentColor"
        mask="url(#lineMdGithubLoop0)"
      >
        <animate
          attributeName="y"
          dur="10s"
          keyTimes="0;0.45;0.46;0.54;0.55;1"
          repeatCount="indefinite"
          values="11;11;7;7;11;11"
        ></animate>
      </rect>
    </svg>
  );
}
