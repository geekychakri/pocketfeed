"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";

import FolderSelect from "@/components/FolderSelect";

import { useRouter } from "next/navigation";

export default function Add() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 max-w-96 w-full mx-auto py-20">
      <h1 className="flex gap-3 items-center text-xl font-medium">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <span>Add a feed</span>
      </h1>
      <form className="flex flex-col gap-6">
        <label htmlFor="url" className="flex flex-col gap-2">
          <span className="font-medium">Please enter a URL</span>
          <input
            type="url"
            id="url"
            required
            placeholder="example.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Continue
        </button>

        <div className="flex flex-col gap-2 border p-3 rounded-md">
          <div>Logo</div>
          <div>Title</div>
          <div>URL</div>
        </div>
        <label className="flex flex-col gap-2">
          <span>Choose a folder</span>
          <FolderSelect />
        </label>
        <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Add
        </button>
      </form>
    </div>
  );
}
