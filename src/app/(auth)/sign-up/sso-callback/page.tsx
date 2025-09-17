import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

import { SpinnerRotate } from "@/components/spinner-rotate";

export default function SSOCallback() {
  // Handle the redirect flow by calling the Clerk.handleRedirectCallback() method
  // or rendering the prebuilt <AuthenticateWithRedirectCallback/> component.
  // This is the final step in the custom OAuth flow.
  return (
    <div className="flex h-[500px] items-center justify-center">
      <SpinnerRotate />
      <AuthenticateWithRedirectCallback signUpUrl="/join" signInUrl="/signin" />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Use 'next/router' for Pages Router
// import { clerkClient } from "@clerk/nextjs/server";
// // import { Clerk } from "@clerk/nextjs/server";
// // import { clerkClient } from "@clerk/nextjs";

// export default function SSOCallback() {
//   const router = useRouter();
//   const [status, setStatus] = useState("Processing authentication...");

//   useEffect(() => {
//     async function handleRedirect() {
//       try {
//         setStatus("Processing authentication...");

//         clerkClient.

//         // Handle the OAuth callback
//         const result = await Clerk.handleRedirectCallback({
//           // This tells Clerk what to do after processing the callback
//           // Usually redirects to the page specified during the oauth flow initiation

//         });

//         if (result.createdSessionId) {
//           setStatus("Authentication successful! Redirecting...");

//           // Get info about the session/sign-up status
//           if (result.status === "complete") {
//             // User has completed sign-in/sign-up
//             router.push(
//               result.firstFactorVerification.strategy === "oauth_github"
//                 ? "/dashboard" // For sign-in
//                 : "/onboarding", // For new users
//             );
//           }
//         }
//       } catch (error) {
//         console.error("Error handling OAuth callback:", error);
//         setStatus("Authentication failed. Please try again.");
//         setTimeout(() => router.push("/sign-in"), 2000);
//       }
//     }

//     handleRedirect();
//   }, [router]);

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
//       <div className="rounded-lg bg-white p-8 text-center shadow-md">
//         <h1 className="mb-4 text-2xl font-bold">Authentication in Progress</h1>
//         <p className="text-gray-600">{status}</p>
//         <div className="mt-4">
//           <div className="mx-auto h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
//         </div>
//       </div>
//     </div>
//   );
// }
