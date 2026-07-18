import { Suspense } from "react";

import RouteBack from "@/components/route-back";

import UploadOPML from "@/app/(dashboard)/components/upload-opml";
import { getDid } from "@/lib/auth/session";

import ExportOPML from "../components/export-opml";

export default function ImportExportOPML() {
  return (
    <div className="border-dashed-x mx-auto flex min-h-screen w-full max-w-130 flex-col gap-12 px-4 py-20">
      <div className="relative flex items-center">
        <RouteBack className="absolute -left-12" />
        <h1 className="text-brand-primary text-lg font-medium">
          Import & Export
        </h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-medium">Import</h2>
          <Suspense
            fallback={
              <div className="bg-skeleton-highlight h-30.5 w-130 animate-pulse rounded-md"></div>
            }
          >
            <UploadOPMLWrapper />
          </Suspense>
        </div>

        <ExportOPML />
      </div>
    </div>
  );
}

async function UploadOPMLWrapper() {
  const did = (await getDid()) as string;
  return <UploadOPML did={did} />;
}
