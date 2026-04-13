"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { PageRecordArray, SelectedPick } from "@xata.io/client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { decode } from "html-entities";
import { useFormState, useFormStatus } from "react-dom";
import { InView, useInView } from "react-intersection-observer";
import { toast } from "sonner";
import useSound from "use-sound";
import { WindowVirtualizer } from "virtua";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { deleteSubscriptions } from "@/app/actions/delete-subscriptions";
import { FeedIcon } from "@/icons/feed";
import { getInitials, internalErrorToast } from "@/lib/utils";
import type { FeedsRecord } from "@/xata";

const initialState = {
  type: "",
  message: "",
};

type FeedsType = PageRecordArray<Readonly<SelectedPick<FeedsRecord, ["*"]>>>;

export default function SubscriptionList({ records }: { records: any }) {
  const [state, formAction, isPending] = useActionState(
    deleteSubscriptions,
    initialState,
  );

  // const { user: loggedInUser } = useUser();
  const params = useParams();
  const displayedUserName = params.username;

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
  const [playCaution] = useSound("/sounds/caution.wav");

  useEffect(() => {
    console.log({ message: state.message });
    if (state.type === "success") {
      toast.success(state.message);
    } else if (state.type === "user-error") {
      toast.error(state.message);
      playCaution();
    } else if (state.type === "internal-error") {
      internalErrorToast(state.message);
      playCaution();
    }
  }, [state]);

  // if (records.length === 0) {
  //   return (
  //     <div className="flex min-h-[300px] flex-col items-center justify-center gap-8">
  //       <div className="flex flex-col items-center justify-center gap-2">
  //         <FeedIcon className="size-20" />
  //         <span>No subscriptions yet!</span>
  //       </div>
  //       {loggedInUser?.username === displayedUserName && (
  //         <Link
  //           href="/add"
  //           className="bg-ui-normal hover:bg-ui-hover flex items-center justify-center rounded-md px-4 py-2 font-medium text-white duration-100"
  //         >
  //           Add a feed
  //         </Link>
  //       )}
  //     </div>
  //   );
  // }

  console.log("CHECKED");
  return (
    <div className="flex flex-col gap-2">
      <form action={formAction} id="subscriptionForm">
        <SubscriptionListStatusBar records={records} isPending={isPending} />
        <div className="flex flex-col empty:border-none">
          {records.length >= 1 ? (
            <WindowVirtualizer>
              {records.map((record: any) => (
                <div
                  // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
                  // href={`/feed/${item.feedId}`}
                  key={record.cid}
                  className="group/folder-feed relative isolate flex w-full items-center justify-between py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
                >
                  <span className="flex items-center gap-3">
                    <Avatar className="bg-ui-normal inline-flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
                      <AvatarImage
                        className="h-full w-full rounded-[inherit] object-cover"
                        // src={
                        //   item.siteURL.includes("youtube.com")
                        //     ? item.favicon
                        //     : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                        // }
                        src={
                          record?.value.favicon ||
                          `https://www.google.com/s2/favicons?domain=${record.value.siteUrl}&sz=128`
                        } //TODO:
                        alt={record.value.title as string}
                      />
                      <AvatarFallback delayMs={400}>
                        {getInitials(record.value.title as string, "folder")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
                      {decode(record.value.title)}
                    </span>
                  </span>
                  <label
                    htmlFor={record.cid}
                    className="hover:bg-ui-hover z-2 flex size-[50px] items-center justify-center rounded-full duration-150"
                  >
                    {/* <input id="test" type="checkbox" className="size-4" /> */}
                    <Checkbox.Root
                      className="bg-ui-normal flex size-[20px] cursor-auto appearance-none items-center justify-center rounded outline-none"
                      // defaultChecked
                      name={`feedIdList[${record.cid}]`}
                      value={record.cid}
                      id={record.cid}
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
                    href={`/feed?feedUrl=${record.value.feedUrl}`}
                    className="absolute inset-0 z-1"
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

function SubscriptionListStatusBar({
  records,
  isPending,
}: {
  records: any;
  isPending: boolean;
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
      className={`bg-background-primary sticky -top-[1px] z-10 flex h-[56px] items-center justify-between transition-[box-shadow] ${isSticky && "shadow-[0_1px_0_0_var(--border-non-interactive)]"}`}
    >
      <h2>
        {records.length}{" "}
        <span className="text-text-secondary">subscriptions</span>
      </h2>
      <Button className="bg-transparent" type="submit" disabled={isPending}>
        {isPending ? (
          <SpinnerRotate className="size-5" />
        ) : (
          <TrashIcon className="size-5" />
        )}
      </Button>
    </InView>
  );
}

// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     // <button
//     //   className="flex h-11 w-full items-center justify-center rounded-md bg-ui-normal px-4 py-2 font-medium text-white"
//     //   disabled={pending}
//     // >
//     //   {pending ? <SpinnerRotate /> : "Add"}
//     // </button>
//     <button
//       //   form="subscriptionForm"
//       className="hover:bg-ui-hover flex size-[50px] items-center justify-center rounded-full duration-150"
//       type="submit"
//       disabled={pending}
//     >
//       {pending ? (
//         <SpinnerRotate className="size-5" />
//       ) : (
//         <TrashIcon className="size-5" />
//       )}
//     </button>
//   );
// }
