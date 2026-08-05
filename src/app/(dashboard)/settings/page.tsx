import Link from "next/link";

import RouteBack from "@/components/route-back";

import FeedbinSync from "./components/feedbin-sync";
import ManualSyncBskyFollows from "./components/manual-sync-bsky-follows";
import SettingsFooter from "./components/settings-footer";

export default async function Settings() {
  return (
    <div className="border-dashed-x mx-auto flex min-h-screen w-full max-w-130 flex-col pb-30">
      <div className="h-14"></div>
      <div className="relative flex h-14 items-center">
        <RouteBack className="absolute -left-12" />
        <h1 className="px-4 text-xl font-medium">Settings</h1>
      </div>

      <ManualSyncBskyFollows />

      <FeedbinSync />

      <div className="border-dashed-b flex flex-col gap-3 px-4 py-8">
        <h2 className="text-brand-primary font-medium">Import/Export Data</h2>
        <Link
          href="/settings/import_export"
          className="custom-underline self-start font-medium"
        >
          Import and Export - Bring your OPML
        </Link>
      </div>
      <SettingsFooter />
    </div>
  );
}
