"use client";

import SocialOauth from "@/app/(auth)/signin/[[...signin]]/components/social-oauth";

export default function Join() {
  return (
    <>
      <h1 className="text-xl">Sign up</h1>
      <SocialOauth />
    </>
  );
}
