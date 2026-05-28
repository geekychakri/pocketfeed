import Link from "next/link";

import RouteBack from "@/components/route-back";

import SettingsFooter from "./components/settings-footer";

export default async function Settings() {
  return (
    <div className="border-dashed-x mx-auto flex min-h-screen w-full max-w-130 flex-col gap-8 px-4 py-20">
      <div className="relative flex items-center">
        <RouteBack className="absolute -left-12" />
        <h1 className="text-xl font-medium">Settings</h1>
      </div>

      <div>
        <Link
          href="/settings/import_export"
          className="custom-underline font-medium"
        >
          Import and Export - Bring your OPML
        </Link>
      </div>
      <SettingsFooter />
    </div>
  );
}
