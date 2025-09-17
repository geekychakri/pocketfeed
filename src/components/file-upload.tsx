"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BoringAvatar from "boring-avatars";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user-avatar";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getInitials, internalErrorToast } from "@/lib/utils";

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

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/uploadAvatar", {
        method: "POST",
        body: formData,
      });
      if (res.status === 401) {
        const { message } = await res.json();
        return toast.error(message);
      }
      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      // setFile(URL.createObjectURL(file));
      const data = (await res.json()) as { msg: string; imgUrl: string };
      console.log(data);
      setFile(data.imgUrl);
      setIsLoading(false);
      toast("Profile picture updated successfully!");
      console.log(data);
      router.refresh();
    } catch (err) {
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
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
      <div className="border-shadow flex gap-6 rounded-md p-8">
        <div className="relative">
          {avatarUrl ? (
            <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex h-16 w-16 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
              <AvatarImage
                className="h-full w-full rounded-[inherit] object-cover"
                src={file}
                alt={username}
              />
              <AvatarFallback
                // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
                delayMs={600}
              >
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <BoringAvatar name={username} size={64} />
          )}
          {/* </div> */}
          {loading && (
            <div className="bg-background-secondary/50 absolute inset-0 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
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
            {/* <Button
              onClickCapture={handleRemove}
              className="border-shadow bg-transparent"
            >
              Remove Image
            </Button> */}
            <Button>Upload Image</Button>
          </div>
        </div>
      </div>
    </FileUploader>
  );
}

export default FileUpload;
