"use client";

import { useState, useEffect, useRef } from "react";
import { useFormStatus, useFormState } from "react-dom";

import qs from "qs";

import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";

import * as Switch from "@radix-ui/react-switch";

import FolderSelect from "@/components/FolderSelect";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/SpinnerRotate";
import Button from "@/components/ui/Button";

import { cn, checkIfObjectIsEmpty, isHttpValid } from "@/lib/utils";
import { addFeeds } from "@/app/actions";

type RssDataType = {
  url: string;
  title: string;
  favicon: string;
  feedUrls: {
    title: string;
    url: string;
  }[];
};

const initialState = {
  message: "",
};

export default function Add() {
  const router = useRouter();

  const [urlValue, setUrlValue] = useState("");
  const [rssData, setRssData] = useState<Partial<RssDataType>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(addFeeds, initialState);

  console.log({ state });

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
          // url: isHttpValid(urlValue) ? urlValue : "https://" + urlValue,
          url: urlValue,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.log({ text });
        throw new Error(text);
      }
      const data: RssDataType = await res.json();
      console.log(data);
      if (checkIfObjectIsEmpty(data)) {
        toast.message("Feed URL not found");
        return;
      }
      const feedUrls = data.feedUrls.map((item, i: number) => {
        return {
          ...item,
          isChecked: i === 0 ? true : false,
        };
      });
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

  console.log({ rssData });

  const handleFormDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const results = qs.parse(Object.fromEntries(formData.entries()) as {});
    console.log(results);
  };

  useEffect(() => {
    if (state?.message) {
      console.log("state msg");
      toast.error(state?.message);
    }
  }, [state]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-10">
      <h1 className="flex items-center gap-3 text-xl font-medium">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <span>Add a feed</span>
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <label htmlFor="url" className="flex flex-col gap-2">
          <span className="font-medium">Please enter a URL</span>
          <input
            type="url"
            id="url"
            placeholder="https://www.example.com"
            autoComplete="off"
            className="rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
            onChange={(e) => {
              setRssData({});
              setUrlValue(e.target.value);
            }}
            onBlur={() => {
              if (!isHttpValid(urlValue) && Boolean(urlValue)) {
                setUrlValue("https://" + urlValue);
              }
            }}
            value={urlValue}
            spellCheck={false}
            required
          />
        </label>

        {isRssDataEmpty && (
          <button
            className={cn(
              "flex h-12 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white",
            )}
            disabled={isLoading}
          >
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
        <div className="flex flex-col gap-6 rounded-md border p-4">
          <img
            src={rssData?.favicon as string}
            width={40}
            height={40}
            className="rounded-full"
            alt="favicon"
          />
          <form action={formAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {rssData?.feedUrls?.map((item, i) => {
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        className="flex-1 rounded border p-2"
                        name={`feeds[${i}][title]`}
                        defaultValue={item.title || rssData?.title}
                        required={i === 0 ? true : false}
                      />
                      {(rssData?.feedUrls?.length ?? 0) > 1 && (
                        //   <input
                        //     type="checkbox"
                        //     name={`feed[${i}][isChecked]`}
                        //     defaultChecked={i === 0 ? true : false}
                        //     required={i === 0 ? true : false}
                        //   />
                        <Switch.Root
                          name={`feeds[${i}][isChecked]`}
                          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-primary"
                          id="airplane-mode"
                          style={{
                            WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                          }}
                          // checked={input.isChecked}
                          // onCheckedChange={onCheckboxChange(index)}
                          defaultChecked={i === 0 ? true : false}
                          // required={i === 0 ? true : false}
                        >
                          <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                      )}
                    </div>

                    <input
                      type="hidden"
                      value={item.url}
                      name={`feeds[${i}][rssURL]`}
                    />

                    <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500">
                      {item.url}
                    </p>
                  </div>
                );
              })}

              <input type="hidden" value={rssData?.favicon} name="favicon" />

              <div className="flex flex-col gap-3">
                <FolderSelect />
              </div>
            </div>
            <p aria-live="polite" className="sr-only">
              {state?.message}
            </p>
            <SubmitButton />
          </form>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white"
      disabled={pending}
    >
      {pending ? <SpinnerRotate /> : "Add"}
    </button>
  );
}
