"use client";

import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  RowSpacingIcon,
  Cross2Icon,
  TriangleRightIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const CollapsibleFolders = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root className="w-full" open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <div className="flex items-center gap-3">
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="#888" strokeWidth="1.5">
                <path d="M4 11.5V5.712c0-.662 0-.993.055-1.268C4.3 3.23 5.312 2.28 6.607 2.052C6.9 2 7.254 2 7.96 2c.31 0 .464 0 .612.013c.641.056 1.25.292 1.745.677a7 7 0 0 1 .443.397l.44.413c.653.612.979.918 1.37 1.122q.323.168.678.263c.43.115.892.115 1.815.115h.299c2.106 0 3.158 0 3.843.577q.095.08.18.168C20 6.387 20 7.375 20 9.348V11.5" />
                <path strokeLinecap="round" d="M10 17h4" />
                <path d="M3.477 17.484C3 14.768 2.76 13.41 3.339 12.433q.223-.376.54-.67C4.704 11 6.038 11 8.705 11h6.59c2.667 0 4 0 4.826.763q.316.294.54.67c.578.977.34 2.335-.138 5.05c-.343 1.956-.515 2.934-1.11 3.582a3 3 0 0 1-.515.445c-.723.49-1.683.49-3.603.49h-6.59c-1.92 0-2.88 0-3.603-.49a3 3 0 0 1-.515-.445c-.595-.648-.767-1.626-1.11-3.581Z" />
              </g>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="#888" strokeWidth="1.5">
                <path strokeLinecap="round" d="M18 10h-5" />
                <path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
              </g>
            </svg>
          )}
          <h1>Folders</h1>
        </div>
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
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="#888888" stroke-width="1.5">
                      <path stroke-linecap="round" d="M14 14h-4" />
                      <path d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
                    </g>
                  </svg>
                </span>
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
