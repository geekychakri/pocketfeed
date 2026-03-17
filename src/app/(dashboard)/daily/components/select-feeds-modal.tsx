"use client";

import * as React from "react";

import { Dialog } from "@base-ui/react/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const SelectFeedsModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex h-10 items-center justify-center rounded-md bg-ui-normal px-3.5 text-base font-medium  select-none hover:bg-ui-hover active:bg-ui-active focus-visible:outline 2 focus-visible:-outline-offset-1">
        Select Feeds
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed max-h-[50vh] scrollbar-gutter-stable scrollbar-width-thin overflow-auto top-1/2 left-1/2 -mt-8 w-[700px] max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-10 text-gray-900 outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
          <Dialog.Title className="sr-only">Select Feeds</Dialog.Title>
          <Dialog.Description render={<div></div>}>
            {children}
          </Dialog.Description>

          <Dialog.Close className="text-text-primary hover:bg-ui-hover absolute top-2.5 right-2.5 inline-flex size-[25px] cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none">
            <Cross2Icon />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SelectFeedsModal;
