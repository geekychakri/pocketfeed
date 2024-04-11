"use client";

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

function FileUpload() {
  const [file, setFile] = useState(null);
  const handleChange = (file: any) => {
    setFile(file);
    console.log(file);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log("REMOVE AVATAR");
  };

  return (
    <FileUploader handleChange={handleChange} name="avatar" types={fileTypes}>
      <div className="flex gap-6 border p-8 rounded-md">
        <div className="">
          <p>Avatar</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Drag and drop an image or select from your files. Your avatar should
            be about 500px wide and under 1MB
          </p>
          <div className="flex items-center gap-4 text-sm">
            <button className="font-medium bg-primary rounded-md text-white px-4 py-2">
              Upload Image
            </button>
            <button onClickCapture={handleRemove}>Remove Image</button>
          </div>
        </div>
      </div>
    </FileUploader>
  );
}

export default FileUpload;
