import RouteBack from "@/components/route-back";

import UploadOPML from "@/app/(dashboard)/components/upload-opml";

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

          <UploadOPML />
        </div>

        <ExportOPML />
      </div>
    </div>
  );
}
