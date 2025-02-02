"use client";

import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  RowSpacingIcon,
  Cross2Icon,
  TriangleRightIcon,
  TriangleDownIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const CollapsibleFolders = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button className="flex w-full items-center justify-between gap-3">
          <span>Folders</span>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content>
        {/* <div className="my-2.5 rounded bg-white p-2.5 shadow-[0_2px_10px] shadow-blackA4">
          <span className="text-[15px] leading-[25px] text-violet11">
            @radix-ui/colors
          </span>
        </div>
        <div className="my-2.5 rounded bg-white p-2.5 shadow-[0_2px_10px] shadow-blackA4">
          <span className="text-[15px] leading-[25px] text-violet11">
            @radix-ui/themes
          </span>
        </div> */}

        <div className="my-2 flex flex-col gap-px">
          {foldersList.map((folder, i) => {
            return (
              <Link
                href={`/folder/${folder.folder}`}
                key={folder.id}
                className="flex h-[30px] items-center gap-4 text-sm"
              >
                {/* <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="#888888" strokeWidth="1.5">
                      <path strokeLinecap="round" d="M14 14h-4" />
                      <path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
                    </g>
                  </svg>
                </span> */}
                {folder.folder}
              </Link>
            );
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleFolders;
