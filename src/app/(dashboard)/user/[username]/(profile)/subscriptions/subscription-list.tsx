"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { decode } from "html-entities";
import localforage from "localforage";
import { InView } from "react-intersection-observer";
import { toast } from "sonner";
import useSWR, { mutate, useSWRConfig } from "swr";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { SpinnerRotate } from "@/components/spinner-rotate";

import { deleteSubscriptions } from "@/app/actions/delete-subscriptions";
import { subscribeToUserFeeds } from "@/app/actions/subscribe-to-user-feeds";
import { getBskyProfile } from "@/data/get-bsky-profile";
import { ERROR_MESSAGE } from "@/lib/constants";
import { fetcher, getInitials, internalErrorToast } from "@/lib/utils";

const initialState = {
  type: "",
  message: "",
  payload: [],
};

type UserFeedsType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;

  externalSub?: true;
}[];

export default function SubscriptionList({
  loggedInHandle,
  loggedInDid,
}: {
  loggedInHandle: string;
  loggedInDid: string;
}) {
  const { username } = useParams<{ username: string }>();

  const { cache } = useSWRConfig();

  console.log({ cacheUsername: cache.get(username) });

  // console.log({ params });

  const { data: bSkyProfileData } = useSWR(username, getBskyProfile, {
    revalidateOnMount: !cache.get(username),
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data, error, isLoading } = useSWR<UserFeedsType>(
    bSkyProfileData?.did
      ? `/api/get-user-feeds?did=${bSkyProfileData.did}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-4">
        {Array.from({ length: 50 }, (_, i) => {
          return (
            <div
              key={i}
              className="bg-skeleton-highlight flex h-8 w-full animate-pulse flex-col gap-4 rounded-md px-4"
            ></div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return <div className="px-4">{ERROR_MESSAGE}</div>;
  }

  if (!data?.length) {
    return <div className="px-4">No subscriptions yet!</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {username === loggedInHandle ? (
        <DeleteSubscriptions did={loggedInDid} data={data} />
      ) : (
        <SubscribeFeeds did={loggedInDid} data={data} />
      )}
    </div>
  );
}

const DeleteSubscriptions = ({
  did,
  data,
}: {
  did: string;
  data: UserFeedsType;
}) => {
  const [isFeedItemChecked, setIsFeedItemChecked] = useState(false);

  const shouldReset = useRef(false);

  const [state, dispatch, isPending] = useActionState(
    deleteSubscriptions,
    initialState,
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const checkboxes = e.currentTarget.querySelectorAll(
      'input[type="checkbox"]',
    );

    const anyChecked = Array.from(checkboxes).some(
      (cb) => (cb as HTMLInputElement).checked,
    );

    setIsFeedItemChecked(anyChecked);
  };

  useEffect(() => {
    console.log({ message: state.message });
    if (state.type === "success") {
      shouldReset.current = true;
      toast.success(state.message);
      mutate(
        `/api/get-user-feeds?did=${did}`,
        (prevFeeds: UserFeedsType | undefined) => {
          console.log({ prevFeeds });

          const ids = new Set(state.payload.map((s) => s.deletedId));
          return prevFeeds?.filter((feed) => !ids.has(feed.id));
          // const filterFeeds = prevFeeds.filter(feed => feed.id !== )
          // return [...state?.payload, ...prevFeeds];
        },
        {
          revalidate: false,
        },
      );
    } else if (state.type === "user-error") {
      shouldReset.current = true;
      toast.error(state.message);
      // playCaution();
    } else if (state.type === "internal-error") {
      shouldReset.current = true;
      internalErrorToast(state.message);
      // playCaution();
    }
  }, [state, did]);

  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;
        startTransition(() => {
          dispatch(null);
        });
      }
    };
  });

  return (
    <form
      action={(formData) => dispatch(formData)}
      id="subscriptionForm"
      onChange={handleFormChange}
    >
      <SubscriptionListStatusBar recordsCount={data.length}>
        {isFeedItemChecked && (
          <button
            disabled={isPending}
            className="bg-ui-normal hover:bg-ui-hover flex h-9 w-30 cursor-pointer items-center justify-center gap-2 rounded-md px-4 font-medium opacity-100 transition-opacity starting:opacity-0"
          >
            Delete
            {isPending && <SpinnerRotate />}
          </button>
        )}
      </SubscriptionListStatusBar>

      <div className="flex flex-col py-2 empty:border-none">
        {/*<WindowVirtualizer>*/}
        {data?.map((record: any) => (
          <div
            // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
            // href={`/feed/${item.feedId}`}
            key={record.id}
            className="group/folder-feed not-last:border-dashed-b relative isolate flex h-18 w-full items-center justify-between px-4 py-2.5 transition-[color]"
          >
            <span className="flex items-center gap-3">
              <Avatar className="bg-ui-normal inline-flex h-7.5 w-7.5 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
                <AvatarImage
                  className="h-full w-full rounded-[inherit] object-cover"
                  // src={
                  //   item.siteURL.includes("youtube.com")
                  //     ? item.favicon
                  //     : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                  // }
                  src={
                    record?.favicon ||
                    `https://www.google.com/s2/favicons?domain=${record.siteUrl}&sz=128`
                  } //TODO:
                  alt={record.title as string}
                />
                <AvatarFallback delayMs={400}>
                  {getInitials(record.title as string, "folder")}
                </AvatarFallback>
              </Avatar>
              <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
                {decode(record.title)}
              </span>
            </span>

            {!record.externalSub && (
              <label
                htmlFor={record.id}
                className="hover:bg-ui-hover z-2 flex size-12.5 cursor-pointer items-center justify-center rounded-full duration-150"
              >
                {/* <input id="test" type="checkbox" className="size-4" /> */}
                <Checkbox.Root
                  className="bg-ui-normal flex size-5 cursor-pointer appearance-none items-center justify-center rounded outline-none"
                  // defaultChecked
                  name={`feedIdList[${record.id}]`}
                  value={record.id}
                  id={record.id}
                  onCheckedChange={() => {
                    // selectSound();
                  }}
                >
                  <Checkbox.Indicator className="text-brand-primary">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </label>
            )}
            {/* <input
              type="hidden"
              value={feed.id}
              name={`feeds[${i}][feedId]`}
            /> */}
            <Link
              href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
              className="absolute inset-0 z-1"
            />
          </div>
        ))}
        {/*</WindowVirtualizer>*/}
      </div>
    </form>
  );
};

const SubscribeFeeds = ({
  did,
  data,
}: {
  did: string;
  data: UserFeedsType;
}) => {
  const [isFeedItemChecked, setIsFeedItemChecked] = useState(false);

  const shouldReset = useRef(false);

  const [state, dispatch, isPending] = useActionState(
    subscribeToUserFeeds,
    initialState,
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const checkboxes = e.currentTarget.querySelectorAll(
      'input[type="checkbox"]',
    );

    const anyChecked = Array.from(checkboxes).some(
      (cb) => (cb as HTMLInputElement).checked,
    );

    setIsFeedItemChecked(anyChecked);
  };

  useEffect(() => {
    if (state.type === "success") {
      mutate(
        `/api/get-user-feeds?did=${did}`,
        (prevFeeds) => {
          console.log({ prevFeeds });
          void localforage.setItem(`user-feeds-${did}`, [
            ...state.payload,
            ...prevFeeds,
          ]);
          return [...state.payload, ...prevFeeds];
        },
        {
          revalidate: false,
        },
      );
      toast.success("Subscribed successfully!");
    }
  }, [state, did]);

  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;
        startTransition(() => {
          dispatch(null);
        });
      }
    };
  });

  return (
    <form
      action={(formData) => dispatch(formData)}
      id="subscriptionForm"
      onChange={handleFormChange}
    >
      <SubscriptionListStatusBar recordsCount={data.length}>
        {isFeedItemChecked && (
          <button
            disabled={isPending}
            className="bg-ui-normal hover:bg-ui-hover flex h-9 w-30 cursor-pointer items-center justify-center gap-2 rounded-md px-4 font-medium opacity-100 transition-opacity starting:opacity-0"
          >
            Subscribe
            {isPending && <SpinnerRotate className="size-5 flex-none" />}
          </button>
        )}
      </SubscriptionListStatusBar>

      <div className="flex flex-col py-2 empty:border-none">
        {/*<WindowVirtualizer>*/}
        {data?.map((record: any) => (
          <div
            // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
            // href={`/feed/${item.feedId}`}
            key={record.id}
            className="group/folder-feed not-last:border-dashed-b relative isolate flex h-18 w-full items-center justify-between px-4 py-2.5 transition-[color]"
          >
            <span className="flex items-center gap-3">
              <Avatar className="bg-ui-normal inline-flex h-7.5 w-7.5 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
                <AvatarImage
                  className="h-full w-full rounded-[inherit] object-cover"
                  // src={
                  //   item.siteURL.includes("youtube.com")
                  //     ? item.favicon
                  //     : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                  // }
                  src={
                    record?.favicon ||
                    `https://www.google.com/s2/favicons?domain=${record.siteUrl}&sz=128`
                  } //TODO:
                  alt={record.title as string}
                />
                <AvatarFallback delayMs={400}>
                  {getInitials(record.title as string, "folder")}
                </AvatarFallback>
              </Avatar>
              <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
                {decode(record.title)}
              </span>
            </span>

            {!record.externalSub && (
              <label
                htmlFor={record.id}
                className="hover:bg-ui-hover z-2 flex size-12.5 cursor-pointer items-center justify-center rounded-full duration-150"
              >
                {/* <input id="test" type="checkbox" className="size-4" /> */}
                <Checkbox.Root
                  className="bg-ui-normal flex size-5 cursor-pointer appearance-none items-center justify-center rounded outline-none"
                  // defaultChecked
                  name={`feedIdList[${record.id}]`}
                  value={record.id}
                  id={record.id}
                  onCheckedChange={() => {
                    // selectSound();
                  }}
                >
                  <Checkbox.Indicator className="text-brand-primary">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </label>
            )}
            {/* <input
              type="hidden"
              value={feed.id}
              name={`feeds[${i}][feedId]`}
            /> */}
            <Link
              href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
              className="absolute inset-0 z-1"
            />
          </div>
        ))}
        {/*</WindowVirtualizer>*/}
      </div>
    </form>
  );
};

function SubscriptionListStatusBar({
  recordsCount,

  children,
}: {
  recordsCount: number;

  children: React.ReactNode;
}) {
  const [isSticky, setIsSticky] = useState(false);
  return (
    <InView
      as="div"
      threshold={1}
      onChange={(inView, entry) => {
        if (entry.intersectionRatio < 1) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }}
      className={`bg-background-primary sticky -top-px z-10 flex h-14 items-center justify-between px-4 transition-shadow max-md:top-13.5 ${isSticky && "shadow-[0_1px_0_0_var(--border-non-interactive)]"}`}
    >
      <h2>
        {recordsCount}{" "}
        <span className="text-text-secondary">subscriptions</span>
      </h2>
      {children}
    </InView>
  );
}
