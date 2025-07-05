"use client";

import UploadOPML from "@/components/UploadOPML";

import FileSaver from "file-saver";

import Button from "@/components/ui/Button";
import { useState } from "react";
import RouteBack from "@/components/RouteBack/RouteBack";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import Link from "next/link";

export default function ImportExportOPML() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/downloadOPML");
      const data = await res.json();
      console.log(data.opml);
      const blob = new Blob([data.opml], { type: "text/xml" });
      FileSaver.saveAs(blob, "pocket-feed.xml");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 py-20">
      <div className="relative flex items-center">
        <RouteBack className="absolute -left-8" />
        <h1 className="text-lg font-semibold">Import & Export</h1>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Import</h2>
        <UploadOPML />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Export</h2>

        <div className="border-shadow flex items-center justify-between rounded-lg p-6">
          <p className="flex-1">Subscriptions</p>
          <Button
            // className="bg-primary rounded-md px-4 py-2 font-medium text-white"
            data-loading={loading}
            className="group/download-opml text-brand-primary grid place-items-center"
            onClick={handleTest}
          >
            <span className="[grid-area:1/1] group-data-[loading=true]/download-opml:invisible">
              Download
            </span>

            <SpinnerRotate
              aria-label="Downloading"
              className="text-text-primary invisible [grid-area:1/1] group-data-[loading=true]/download-opml:visible"
            />
          </Button>
        </div>
      </div>
      <Link
        href="/settings/import_history"
        className="custom-underline self-start"
      >
        Check Import History
      </Link>
    </div>
  );
}
