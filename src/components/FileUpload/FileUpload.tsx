"use client";

import Avatar from "boring-avatars";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "sonner";
import { SpinnerRotate } from "../SpinnerRotate";

const fileTypes = ["JPG", "PNG", "GIF"];

function FileUpload({
  username,
  avatarUrl,
}: {
  username: string;
  avatarUrl: string;
}) {
  const [file, setFile] = useState(avatarUrl);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (file: any) => {
    // setFile(file);
    // console.log(file);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/uploadAvatar", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      return; //TODO:
    }

    // setFile(URL.createObjectURL(file));
    const data = (await res.json()) as { msg: string; imgUrl: string };
    console.log(data);
    setFile(data.imgUrl);
    setIsLoading(false);
    toast("Profile picture updated successfully!");
    console.log(data);
    router.refresh();
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log("REMOVE AVATAR");
  };

  return (
    <FileUploader
      handleChange={handleChange}
      name="avatar"
      types={fileTypes}
      classes="outline-none"
      maxSize={1}
      onSizeError={() => console.log("Max size 1MB")}
    >
      <div className="flex gap-6 rounded-md border p-8">
        <div className="relative">
          <div className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-gray-300 bg-yellow-200">
            {avatarUrl ? (
              <img
                src={file}
                className="max-w-full rounded-full object-contain"
                alt=""
              />
            ) : (
              <Avatar name={username} />
            )}
          </div>
          {loading && (
            <div className="z-2 absolute inset-0 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.7)]">
              <SpinnerRotate />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Drag and drop an image or select from your files. Your avatar should
            be about 500px wide and under 1MB
          </p>
          <div className="flex items-center gap-4 text-sm">
            <button className="rounded-md bg-primary px-4 py-2 font-medium text-white">
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
