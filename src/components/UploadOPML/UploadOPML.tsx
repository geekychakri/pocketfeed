"use client";

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";

import { useOPMLFeed } from "@/store/opmlfeed";

const fileTypes = ["XML"];

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const { addFeed } = useOPMLFeed();

  const handleChange = (file: any) => {
    setFile(file);
  };

  const handleImport = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!file) return;
    const formData = new FormData();
    formData.append("opmlFile", file as File);
    try {
      const res = await fetch("/api/parseOPML", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      addFeed(data);
      router.push("/settings/import_export/import_feeds");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FileUploader
      handleChange={handleChange}
      name="file"
      types={fileTypes}
      classes="outline-none"
      required={true}
    >
      <div className="flex items-center justify-between border p-6 rounded-2xl">
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-center">
            <button className="font-medium rounded-md border px-4 py-2 outline-none">
              Browse...
            </button>
            <span>{file ? file?.name : "No file selected"}</span>
          </div>
          <p className="text-gray-400">You can import OPML files.</p>
        </div>
        <div>
          <button
            className="font-medium bg-primary text-white px-4 py-2 rounded-md"
            onClickCapture={handleImport}
          >
            Import
          </button>
        </div>
      </div>
    </FileUploader>
  );
}

export default FileUpload;
