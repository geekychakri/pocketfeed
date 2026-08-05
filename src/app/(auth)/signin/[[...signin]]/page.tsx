import RouteBack from "@/components/route-back";

import SocialOauth from "./components/social-oauth";

export default function SignIn() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="flex flex-col gap-2">
          <span className="relative flex items-center gap-4 text-xl font-medium max-md:flex-col max-md:items-baseline">
            <RouteBack className="absolute -left-12 max-md:static max-md:self-start" />
            Use your Atmosphere account
          </span>
          <span className="text-text-secondary text-sm text-pretty">
            You can sign in with an account from any app in the atmosphere.
          </span>
          <span className="text-text-secondary text-sm text-pretty">
            If you have an account on{" "}
            <span className="text-[#006aff]">Bluesky</span>,{" "}
            <span className="text-danger">pckt.blog</span> or{" "}
            <span className="text-[#57822b]">leaflet.pub</span> you already have
            an Atmosphere account.
          </span>
        </p>
      </div>
      <SocialOauth />
    </>
  );
}
