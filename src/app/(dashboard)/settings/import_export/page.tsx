"use client";

import UploadOPML from "@/components/UploadOPML";

import FileSaver from "file-saver";

export default function ImportExportOPML() {
  const handleTest = async () => {
    const res = await fetch("/api/downloadOPML");
    const data = await res.json();
    console.log(data.opml);
    const blob = new Blob([data.opml], { type: "text/xml" });
    FileSaver.saveAs(blob, "pocket-feed.xml");
  };
  return (
    <main className="mx-auto flex w-full max-w-[520px] flex-col gap-12 py-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Import</h1>
        <UploadOPML />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Export</h1>
        <button
          className="rounded-md bg-primary px-4 py-2 font-medium text-white"
          onClick={handleTest}
        >
          Download
        </button>
        {/* <button onClick={handleTest}>Test</button> */}
      </div>
    </main>
  );
}
