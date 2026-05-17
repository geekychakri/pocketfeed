"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import { mutate } from "swr";
import useSound from "use-sound";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";

import { addFeeds } from "@/app/actions/add-feeds";
import { EditIcon } from "@/icons/edit";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import {
  checkIfObjectIsEmpty,
  getInitials,
  internalErrorToast,
  isHttpValid,
} from "@/lib/utils";

type RSSFinderType = {
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
  payload: [],
};

type Action = { type: "SUBMIT"; data: FormData } | { type: "RESET" };
type State = { type: string; message: string | null; payload: [] };

export default function AddFeed({ did }: { did: string }) {
  const [urlValue, setUrlValue] = useState("");
  const [rssData, setRssData] = useState<Partial<RSSFinderType>>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const shouldReset = useRef(false);

  const [playToggleOn] = useSound("sounds/toggle_on.wav", {
    volume: 0.25,
  });
  const [playToggleOff] = useSound("sounds/toggle_off.wav", {
    volume: 0.25,
  });
  const [playCaution] = useSound("sounds/caution.wav", {
    volume: 0.25,
  });

  const [state, dispatch, isPending] = useActionState(addFeeds, initialState);

  // const submitAction = (data: FormData) => dispatch({ type: "SUBMIT", data });

  console.log({ state });

  const isRssDataEmpty = checkIfObjectIsEmpty(rssData);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
      const data: RSSFinderType = await res.json();
      console.log(data);
      if (checkIfObjectIsEmpty(data)) {
        toast.warning("Feed URL not found");
        playCaution();
        return;
      }
      // const feedUrls = data.feedUrls.map((item, i: number) => {
      //   return {
      //     ...item,
      //     isChecked: i === 0 ? true : false,
      //   };
      // });
      setRssData(data);
    } catch (error) {
      playCaution();
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state?.type === "internal-error") {
      shouldReset.current = true;
      internalErrorToast(state?.message);
    } else if (state?.type === "error") {
      shouldReset.current = true;
      toast.error(state?.message, {
        id: "error",
      });
      playCaution();
      return;
    }
    if (state?.payload.length >= 1) {
      shouldReset.current = true;
      console.log({ payload: [...state.payload] });
      mutate(
        `/api/get-user-feeds?did=${did}`,
        (prevFeeds) => {
          console.log({ prevFeeds });
          return [...state?.payload, ...prevFeeds];
        },
        {
          revalidate: false,
        },
      );

      router.push(
        `/feed?feedUrl=${state?.payload[0].feedUrl}&title=${encodeURIComponent(state?.payload[0].title)}`,
      );
    }
  }, [state, playCaution]);

  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;
        setRssData({});
        setUrlValue("");
        startTransition(() => {
          dispatch(null);
        });
      }
    };
  }, [dispatch]);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-3">
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
            className="border-shadow flex gap-1 items-center justify-center"
            disabled={isLoading}
          >
            <span>Continue</span>

            {isLoading && (
              <span>
                <SpinnerRotate className="size-5" />
              </span>
            )}
          </Button>
        )}
      </form>

      {!isRssDataEmpty && (
        <div className="border-shadow flex flex-col gap-6 rounded-md p-4">
          <Avatar className="bg-ui-normal inline-flex h-7 w-7 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={
                rssData.favicon ||
                `https://www.google.com/s2/favicons?domain=${rssData.url}&sz=28`
              }
              alt={rssData.title}
            />
            <AvatarFallback className="text-sm">
              {getInitials(rssData.title as string)}
            </AvatarFallback>
          </Avatar>
          <form
            action={(formData) => dispatch(formData)}
            className="flex flex-col gap-6"
          >
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
                        <Switch.Root
                          name={`feeds[${i}][isChecked]`}
                          className="bg-ui-normal relative h-6.25 w-10.5 cursor-default rounded-full outline-none brand-primary data-[state=checked]:bg-[rgba(252,89,30,0.2)]"
                          id={`select-feed-${i}`}
                          style={{
                            WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                          }}
                          onCheckedChange={(checked) => {
                            console.log({ checked });
                            checked ? playToggleOn() : playToggleOff();
                          }}
                          defaultChecked={i === 0 ? true : false}
                        >
                          <Switch.Thumb className="bg-brand-primary block h-5.25 w-5.25 translate-x-0.5 rounded-full shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4.75" />
                        </Switch.Root>
                      )}
                    </div>

                    <input
                      type="hidden"
                      value={item.url}
                      name={`feeds[${i}][rssUrl]`}
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
              <input type="hidden" value={rssData?.url} name="siteUrl" />
              {/*<FolderSelect folders={["Home", "test"]} />*/}
            </div>

            <p aria-live="polite" className="sr-only">
              {state?.message}
            </p>
            <Button
              className="border-shadow gap-1 flex items-center justify-center"
              disabled={isPending}
            >
              <span>Add</span>
              {isPending && <SpinnerRotate className="size-5" />}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
