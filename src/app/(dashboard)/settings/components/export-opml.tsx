"use client";

import { useState } from "react";

import FileSaver from "file-saver";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { internalErrorToast } from "@/lib/utils";

export default function ExportOPML() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/download-opml");
      console.log({ res });

      if (res.status === 401) {
        const { message } = await res.json();
        return toast.error(message);
      }
      if (res.status === 500) {
        throw new Error();
      }
      const data = await res.json();
      console.log(data.opml);
      const blob = new Blob([data.opml], { type: "text/xml" });
      FileSaver.saveAs(blob, "pocket-feed.xml");
    } catch (err) {
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium">Export</h2>

      <div className="flex items-center justify-between rounded-lg border-dashed p-6">
        <p className="flex-1">Subscriptions</p>
        <Button
          // className="bg-primary rounded-md px-4 py-2 font-medium text-white"
          // data-loading={loading}
          // className="group/download-opml text-brand-primary grid place-items-center"
          className="flex items-center gap-1"
          onClick={handleTest}
        >
          {/*<span className="[grid-area:1/1] group-data-[loading=true]/download-opml:invisible">
            Download
          </span>*/}

          <span>Download</span>
          {loading && (
            <SpinnerRotate
            // aria-label="Downloading"
            // className="text-text-primary invisible [grid-area:1/1] group-data-[loading=true]/download-opml:visible"
            />
          )}
        </Button>
      </div>
    </div>
  );
}
