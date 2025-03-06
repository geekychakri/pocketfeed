"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import { useFormState, useFormStatus } from "react-dom";

import { SpinnerRotate } from "@/components/SpinnerRotate";

import { getInitials } from "@/lib/utils";
import Link from "next/link";

import { decode } from "html-entities";

import * as Checkbox from "@radix-ui/react-checkbox";

import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";

import type { FeedsRecord } from "@/xata";

import { PageRecordArray, SelectedPick } from "@xata.io/client";

import { WindowVirtualizer } from "virtua";

import { deleteSubscriptions } from "@/app/actions";
import { useEffect, useState, useRef } from "react";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { useInView, InView } from "react-intersection-observer";

const initialState = {
  message: "",
};

import useSound from "use-sound";

type FeedsType = PageRecordArray<Readonly<SelectedPick<FeedsRecord, ["*"]>>>;

export default function SubscriptionList({ feeds }: { feeds: FeedsType }) {
  const [state, formAction] = useFormState(deleteSubscriptions, initialState);

  // const [isHidden, setIsHidden] = useState(true);

  // const { scrollY } = useScroll();

  // useMotionValueEvent(scrollY, "change", (y) => {
  //   console.log({ y });
  //   if (y > 300) {
  //     setIsHidden(true);
  //   } else {
  //     setIsHidden(false);
  //   }
  // });

  const [selectSound] = useSound("/sounds/select.wav");

  useEffect(() => {
    console.log({ message: state.message });
  }, [state]);

  console.log("CHECKED");
  return (
    <div className="flex flex-col gap-2">
      <form action={formAction} id="subscriptionForm">
        <SubscriptionListStatusBar feeds={feeds} />
        <div className="flex flex-col empty:border-none">
          {feeds.length >= 1 ? (
            <WindowVirtualizer>
              {feeds.map((feed, i) => (
                <div
                  // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
                  // href={`/feed/${item.feedId}`}
                  key={feed.id}
                  className="group/folder-feed relative isolate flex w-full items-center justify-between py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
                >
                  <span className="flex items-center gap-3">
                    <Avatar className="inline-flex h-[30px] w-[30px] flex-none cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-ui-normal">
                      <AvatarImage
                        className="h-full w-full rounded-[inherit] object-cover"
                        // src={
                        //   item.siteURL.includes("youtube.com")
                        //     ? item.favicon
                        //     : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                        // }
                        src={feed.favicon as string} //TODO:
                        alt={feed.title as string}
                      />
                      <AvatarFallback delayMs={400}>
                        {getInitials(feed.title as string, "folder")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="line-clamp-1 transition-[color] group-hover/folder-feed:text-brand-primary">
                      {decode(feed.title)}
                    </span>
                  </span>
                  <label
                    htmlFor={feed.id}
                    className="z-[2] flex size-[50px] items-center justify-center rounded-full duration-150 hover:bg-ui-hover"
                  >
                    {/* <input id="test" type="checkbox" className="size-4" /> */}
                    <Checkbox.Root
                      className="flex size-[20px] cursor-auto appearance-none items-center justify-center rounded bg-ui-normal outline-none"
                      // defaultChecked
                      name={`feedIdList[${feed.id}]`}
                      value={feed.id}
                      id={feed.id}
                      onCheckedChange={() => {
                        selectSound();
                      }}
                    >
                      <Checkbox.Indicator className="text-brand-primary">
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </label>
                  {/* <input
                  type="hidden"
                  value={feed.id}
                  name={`feeds[${i}][feedId]`}
                /> */}
                  <Link
                    href={`/feed/${feed.feedId}`}
                    className="absolute inset-0 z-[1]"
                  />
                </div>
              ))}
            </WindowVirtualizer>
          ) : (
            <p>No subscriptions found!</p>
          )}
        </div>
      </form>
    </div>
  );
}

function SubscriptionListStatusBar({ feeds }: { feeds: FeedsType }) {
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
      className={`sticky -top-[1px] z-[10] flex h-[56px] items-center justify-between bg-background-primary transition-[box-shadow] ${isSticky && "shadow-[0_1px_0_0_var(--border-non-interactive)]"}`}
    >
      <h2>
        {feeds.length}{" "}
        <span className="text-text-secondary">subscriptions</span>
      </h2>
      <SubmitButton />
    </InView>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    // <button
    //   className="flex h-11 w-full items-center justify-center rounded-md bg-ui-normal px-4 py-2 font-medium text-white"
    //   disabled={pending}
    // >
    //   {pending ? <SpinnerRotate /> : "Add"}
    // </button>
    <button
      //   form="subscriptionForm"
      className="flex size-[50px] items-center justify-center rounded-full duration-150 hover:bg-ui-hover"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <SpinnerRotate className="size-5" />
      ) : (
        <TrashIcon className="size-5" />
      )}
    </button>
  );
}
