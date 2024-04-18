"use client";

import { useState } from "react";

import { ArrowLeftIcon } from "@radix-ui/react-icons";

import FolderSelect from "@/components/FolderSelect";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/SpinnerRotate";

import { checkIfObjectIsEmpty } from "@/lib/utils";

type RssDataType = {
  url: string;
  title: string;
  favicon: string;
  feedUrl: {
    title: string;
    url: string;
  };
};

export default function Add() {
  const router = useRouter();

  const [urlValue, setUrlValue] = useState("");
  const [rssData, setRssData] = useState<Partial<RssDataType>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isRssDataEmpty = checkIfObjectIsEmpty(rssData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/findFeed", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url: urlValue,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.log({ text });
        throw new Error(text);
      }
      const data = await res.json();
      console.log(data);
      if (checkIfObjectIsEmpty(data)) {
        toast.message("Feed URL not found");
        return;
      }
      setRssData(data);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-96 w-full mx-auto py-20">
      <h1 className="flex gap-3 items-center text-xl font-medium">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <span>Add a feed</span>
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <label htmlFor="url" className="flex flex-col gap-2">
          <span className="font-medium">Please enter a URL</span>
          <input
            type="url"
            id="url"
            required
            placeholder="example.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
            onChange={(e) => {
              setRssData({});
              setUrlValue(e.target.value);
            }}
            spellCheck={false}
          />
        </label>
        {isRssDataEmpty && (
          <button className="bg-primary flex items-center justify-center font-medium text-white px-4 py-2 h-12 rounded-md">
            {isLoading ? (
              <span>
                <SpinnerRotate />
              </span>
            ) : (
              <span>Continue</span>
            )}
          </button>
        )}
      </form>
      {!isRssDataEmpty && (
        <>
          <div className="flex flex-col gap-2 border p-3 rounded-md">
            <div>
              <img
                src={rssData?.favicon as string}
                width={20}
                height={20}
                className="rounded-full"
                alt="favicon"
              />
            </div>
            <h2 className="font-medium">{rssData?.title}</h2>
            <p className="text-sm break-words">{rssData?.url}</p>
          </div>
          <label className="flex flex-col gap-2">
            <span>Choose a folder</span>
            <FolderSelect />
          </label>
          <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
            Add
          </button>
        </>
      )}
    </div>
  );
}
