import Link from "next/link";

import RouteBack from "@/components/route-back";
import Button from "@/components/ui/custom-button";

import SettingsFooter from "./components/settings-footer";

export default async function Settings() {
  return (
    <div className="mx-auto flex w-full max-w-130 flex-col gap-8 py-20">
      <div className="relative flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-xl font-medium">Settings</h1>
      </div>
      <div className="border-shadow flex items-center justify-between rounded-md p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">Membership Status</h2>
          <span className="bg-brand-primary/10 text-brand-primary self-start rounded-sm px-2 py-1 text-sm">
            Free
          </span>
        </div>
        <div>
          <Button id="main-item">Upgrade</Button>
        </div>
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
