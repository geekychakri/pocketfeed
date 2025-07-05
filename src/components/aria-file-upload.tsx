import { useState } from "react";
import {
  FileTrigger,
  Button as AriaButton,
  DropZone,
} from "react-aria-components";
import type { FileDropItem } from "react-aria";
import Button from "./ui/Button";

export default function AriaFileUpload() {
  const [file, setFile] = useState<string | null>(null);

  return (
    <DropZone
      className="dropzone data-drop-target:border-brand-primary data-drop-target:bg-brand-primary/5 flex justify-between gap-3 border p-6"
      getDropOperation={(types) => (types.has("text/xml") ? "copy" : "cancel")}
      onDrop={async (e) => {
        let files = e.items.filter(
          (file) => file.kind === "file",
        ) as FileDropItem[];
        console.log({ files });

        const { size } = await files[0].getFile();
        console.log(size);
        if (size > 3000) {
          return alert("Size too large!");
        }
        let filenames = files.map((file) => file.name);
        setFile(filenames[0]);
      }}
    >
      <div className="flex items-center gap-2">
        <FileTrigger
          acceptedFileTypes={[".xml", ".opml"]}
          onSelect={(e) => {
            console.log(e);
            let files = e ? Array.from(e) : [];
            if (files[0].size > 3000) {
              return alert("Size too large!");
            }
            let filenames = files.map((file) => file.name);
            setFile(filenames[0]);
          }}
        >
          <AriaButton className="border-shadow rounded-md px-4 py-2">
            Browse...
          </AriaButton>
          <p>{file ? file : "No file selected"}</p>
        </FileTrigger>
      </div>

      <Button
        type="submit"
        onClick={(e) => alert("hello")}
        className={`grid place-items-center ${file ? "text-brand-primary" : "text-text-secondary"}`}
      >
        <span>Import</span>
      </Button>
    </DropZone>
  );
}
