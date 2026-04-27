import SocialOauth from "./components/social-oauth";

export default function SignIn() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="flex flex-col gap-2">
          <span className="text-xl font-medium">
            Use your Atmosphere account
          </span>
          <span className="text-text-secondary text-sm text-pretty">
            You can sign in with an account from any app in the atmosphere.
          </span>
          <span className="text-text-secondary text-sm text-pretty">
            If you have an account on{" "}
            <span className="text-[#006aff]">Bluesky</span>, Tangled or{" "}
            <span className="text-[#57822b]">Leaflet</span> you already have an
            Atmosphere account.
          </span>
        </p>
      </div>
      <SocialOauth />
    </>
  );
}
