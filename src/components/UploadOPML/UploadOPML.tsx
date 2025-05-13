"use client";

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";

import { useOPMLFeed } from "@/store/opmlfeed";
import Button from "../ui/Button";
import { SpinnerRotate } from "../SpinnerRotate";

import { revalidateCachePath } from "@/lib/revalidateCachePath";

import { toast } from "sonner";

const fileTypes = ["XML", "OPML"];

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { addFeed } = useOPMLFeed();

  const handleChange = (file: any) => {
    setFile(file);
  };

  // const handleImport = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   e.stopPropagation();
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("opmlFile", file as File);
  //   try {
  //     const res = await fetch("/api/parseOPML", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     addFeed(data);
  //     router.push("/settings/import_export/import_feeds");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/parseOPML", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("");
      }
      const data = await res.json();
      console.log(data);
      // addFeed(data);

      revalidateCachePath("/(dashboard)", "layout");
      toast.success("Imported Successfully 🎉");
      setTimeout(() => {
        router.push(`/folder/${data.redirectFolderName}`);
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleImport}>
      <FileUploader
        handleChange={handleChange}
        name="opmlFile"
        types={fileTypes}
        // classes="outline-none"
        required={true}
      >
        <div className="border-border-interactive flex items-center justify-between rounded-lg border border-dashed p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <button className="border-shadow rounded-md px-4 py-2 font-medium outline-none">
                Browse...
              </button>
              <span>{file ? file?.name : "No file selected"}</span>
            </div>
            <p className="text-text-secondary">You can import OPML files.</p>
          </div>
          <div>
            <Button
              data-loading={loading}
              type="submit"
              className={`group/import-opml grid place-items-center ${file && file?.name ? "text-brand-primary" : "text-text-secondary"}`}
              onClickCapture={(e) => e.stopPropagation()}
            >
              <span className="[grid-area:1/1] group-data-[loading=true]/import-opml:invisible">
                Import
              </span>

              <SpinnerRotate
                aria-label="Downloading"
                className="text-text-primary invisible [grid-area:1/1] group-data-[loading=true]/import-opml:visible"
              />
            </Button>
          </div>
        </div>
      </FileUploader>
    </form>
  );
}

export default FileUpload;
