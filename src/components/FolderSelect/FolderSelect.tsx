"use client";

import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const folders = ["Home", "Tech", "Music", "News", "Podcast"]; //TODO:

const FolderSelect = ({
  onShowNewFolderInput,
}: {
  onShowNewFolderInput: (val: boolean) => void;
}) => {
  const [value, setValue] = React.useState("Home");

  return (
    <Select.Root
      value={value}
      onValueChange={(value) => {
        if (value === "New Folder") {
          onShowNewFolderInput(true);
        } else {
          onShowNewFolderInput(false);
        }
        setValue(value);
      }}
    >
      <Select.Trigger
        className="inline-flex items-center justify-between rounded-md px-4 py-2 gap-[5px] border outline-none"
        aria-label="folder"
      >
        <Select.Value placeholder="Select a folder" />
        <Select.Icon className="text-primary">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white border rounded-md shadow-[0px_8px_30px_rgba(0,0,0,.12)]">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {folders.map((folder, index) => {
              return (
                <SelectItem value={folder} key={index}>
                  {folder}
                </SelectItem>
              );
            })}
            <SelectItem value="New Folder" key="new-folder">
              Create a new folder
            </SelectItem>
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn(
        "text-sm leading-none rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] py-4 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-primary data-[highlighted]:text-white",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = "SelectItem";

export default FolderSelect;
