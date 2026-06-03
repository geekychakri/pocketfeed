import { NextRequest, NextResponse } from "next/server";

import getSession from "./lib/iron-session/get-iron-session";

const protectedRoutes = [
  "/feed",
  "/activity",
  "/add",
  "/daily",
  "/discover",
  "/read",
  "/settings",
  "/user",
];

const publicRoutes = ["/", "/signin"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session.user?.did) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session.user?.did) {
    return NextResponse.redirect(new URL("/activity/discover", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js api, internals and all static files, unless found in search params
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|wav|mp3)).*)",
  ],
};
