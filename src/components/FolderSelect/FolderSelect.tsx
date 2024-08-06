"use client";

import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { Label } from "@radix-ui/react-label";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const folders = ["Home", "Tech", "Music", "News", "Podcast"]; //TODO:

const FolderSelect = () => {
  const [value, setValue] = React.useState("Home");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="folder" className="font-semibold">
        Choose a folder
      </Label>
      <Select.Root
        name="folder"
        value={value}
        onValueChange={(value) => {
          if (value === "New Folder") {
            setShowNewFolderInput(true);
          } else {
            setShowNewFolderInput(false);
          }
          setValue(value);
        }}
        required
      >
        <Select.Trigger
          className="inline-flex items-center justify-between gap-[5px] rounded-md border px-4 py-2 outline-none"
          aria-label="folder"
          id="folder"
        >
          <Select.Value placeholder="Select a folder" />
          <Select.Icon className="text-primary">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-md border bg-white shadow-[0px_8px_30px_rgba(0,0,0,.12)]">
            <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
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

            <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {showNewFolderInput && (
        <input
          type="text"
          name="folder"
          placeholder="New folder name"
          className="w-full rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
          required
        />
      )}
    </div>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn(
        "relative flex h-[25px] select-none items-center rounded-[3px] py-4 pl-[25px] pr-[35px] text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[disabled]:text-mauve8 data-[highlighted]:text-white data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = "SelectItem";

export default FolderSelect;
