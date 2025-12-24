import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/join(.*)",
  "/sign-up(.*)",
  "/signin(.*)",
  "/new-password",
  "/api/webhooks(.*)",
  "/api/inngest(.*)",
  "/",
  "/test",
  "/dynamic-html-highlight",
]);

const isProtectedRoute = createRouteMatcher(["/folder(.*)"]);
export default clerkMiddleware(async (auth, request) => {
  // console.log({ request });
  console.log("Requested URL:", request.nextUrl.pathname);
  console.log("Is public route:", isPublicRoute(request));
  if (!isPublicRoute(request)) {
    console.log("MIDDLEWARE");
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|wav|mp3)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
