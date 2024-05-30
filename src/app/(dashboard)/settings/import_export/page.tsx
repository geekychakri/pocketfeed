"use client";

import UploadOPML from "@/components/UploadOPML";

export default function ImportExportOPML() {
  const handleTest = async () => {
    const formData = new FormData();
    formData.append("test", "test");
    const res = await fetch("/api/test", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <main className="flex flex-col gap-12 w-full max-w-[520px] mx-auto py-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Import</h1>
        <UploadOPML />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Export</h1>
        <button className="font-medium bg-primary text-white px-4 py-2 rounded-md">
          Download
        </button>
        <button onClick={handleTest}>Test</button>
      </div>
    </main>
  );
}
