"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { useFormStatus, useFormState } from "react-dom";

import DOMPurify from "isomorphic-dompurify";

import qs from "qs";

import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";

import * as Switch from "@radix-ui/react-switch";

import FolderSelect from "@/components/folder-select";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";

import {
  cn,
  checkIfObjectIsEmpty,
  isHttpValid,
  toastError,
  internalErrorToast,
} from "@/lib/utils";
// import { addFeeds } from "@/app/actions";
import { addFeeds } from "@/app/actions/add-feeds";

import useSound from "use-sound";
import RouteBack from "@/components/route-back";
import { EditIcon } from "@/icons/edit";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

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
  type: "",
  message: "",
};

export default function AddFeed({ folders }: { folders: any }) {
  const router = useRouter();

  const [urlValue, setUrlValue] = useState("");
  const [rssData, setRssData] = useState<Partial<RssDataType>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [playToggleOn] = useSound("sounds/toggle_on.wav");
  const [playToggleOff] = useSound("sounds/toggle_off.wav");
  const [playCaution] = useSound("sounds/caution.wav");

  const [state, formAction, isPending] = useActionState(addFeeds, initialState);

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
      playCaution();
      // let message;
      // if (error instanceof Error) message = error.message;
      // else message = String(error);
      // toastError(message);
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
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
    if (state?.type === "internal-error") {
      internalErrorToast(state?.message);
    } else if (state?.type === "error") {
      toast.error(state?.message);
      playCaution();
    }
  }, [state]);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-3 py-14">
      {/* <RouteBack className="absolute -left-9" />
      <h1 className="flex items-center gap-3 text-xl font-medium">
        <span>Add a feed</span>
      </h1> */}

      <div className="relative flex h-14 items-center gap-1">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-xl font-semibold">Add a feed</h1>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <label htmlFor="url" className="flex flex-col gap-2">
          <span className="text-brand-primary text-sm font-medium">
            Please enter a URL
          </span>
          <Input
            type="url"
            id="url"
            placeholder="https://www.example.com"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!isHttpValid(urlValue) && Boolean(urlValue)) {
                  setUrlValue("https://" + urlValue);
                }
              }
            }}
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
          <Button
            // className={cn(
            //   "flex h items-center justify-center rounded-md bg-ui-normal px-4 py-2 font-medium text-text-primary duration-100 hover:bg-ui-hover",
            // )}
            className="border-shadow flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                <SpinnerRotate />
              </span>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        )}
      </form>

      {!isRssDataEmpty && (
        <div className="border-shadow flex flex-col gap-6 rounded-md p-4">
          <img
            src={
              rssData.url?.includes("youtube.com")
                ? rssData.favicon
                : `https://www.google.com/s2/favicons?domain=${rssData.url}&sz=128`
            }
            width={28}
            height={28}
            className="rounded-full"
            alt="favicon"
          />
          <form action={formAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {rssData?.feedUrls?.map((item, i) => {
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <div className="border-shadow focus-within:outline-brand-primary flex w-full rounded-md focus-within:outline-2">
                        <Input
                          type="text"
                          className="flex-1 border-none shadow-none! outline-none"
                          name={`feeds[${i}][title]`}
                          defaultValue={
                            rssData.url?.includes("youtube.com")
                              ? rssData?.title
                              : item.title || rssData?.title
                          }
                          required={i === 0 ? true : false}
                          placeholder={new URL(urlValue).hostname}
                        />
                        <span
                          className="flex items-center justify-center px-4"
                          onClick={(e) =>
                            (
                              e.currentTarget
                                .previousElementSibling as HTMLInputElement
                            ).focus()
                          }
                        >
                          <EditIcon />
                        </span>
                      </div>
                      {(rssData?.feedUrls?.length ?? 0) > 1 && (
                        //   <input
                        //     type="checkbox"
                        //     name={`feed[${i}][isChecked]`}
                        //     defaultChecked={i === 0 ? true : false}
                        //     required={i === 0 ? true : false}
                        //   />
                        <Switch.Root
                          name={`feeds[${i}][isChecked]`}
                          className="bg-ui-normal relative h-[25px] w-[42px] cursor-default rounded-full outline-none data-[state=checked]:bg-[rgba(252,89,30,0.2)]"
                          id={`select-feed-${i}`}
                          style={{
                            WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                          }}
                          // checked={input.isChecked}
                          // onCheckedChange={onCheckboxChange(index)}
                          onCheckedChange={(checked) => {
                            console.log({ checked });
                            checked ? playToggleOn() : playToggleOff();
                          }}
                          defaultChecked={i === 0 ? true : false}
                          // required={i === 0 ? true : false}
                        >
                          <Switch.Thumb className="bg-brand-primary shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                      )}
                    </div>

                    <input
                      type="hidden"
                      value={item.url}
                      name={`feeds[${i}][rssURL]`}
                    />

                    <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-gray-500">
                      {item.url}
                    </p>
                  </div>
                );
              })}

              {rssData?.favicon && (
                <input type="hidden" value={rssData?.favicon} name="favicon" />
              )}
              <input type="hidden" value={rssData?.url} name="siteURL" />

              <div className="flex flex-col gap-3">
                <FolderSelect folders={folders} />
              </div>
            </div>
            <p aria-live="polite" className="sr-only">
              {state?.message}
            </p>
            <Button
              className="border-shadow flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? <SpinnerRotate /> : "Add"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
