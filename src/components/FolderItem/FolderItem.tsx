import { useHotkeys } from "react-hotkeys-hook";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { CheckIcon } from "@radix-ui/react-icons";

const FolderItem = ({
  folder,
  index,
  isChecked,
  onSelect,
}: {
  folder: string;
  index: number;
  isChecked: DropdownMenu.DropdownMenuCheckboxItemProps["checked"];
  onSelect: (folder: string) => void;
}) => {
  const shortcutKey = index + 1;
  useHotkeys(shortcutKey.toString(), () => {
    onSelect(folder);
  });

  return (
    <DropdownMenu.CheckboxItem
      checked={isChecked}
      onSelect={() => onSelect(folder)}
      className="group text-[14px] leading-none rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 py-4"
      key={index}
    >
      <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="text-primary" />
      </DropdownMenu.ItemIndicator>
      {folder}{" "}
      <kbd className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-black duration-150 group-data-[disabled]:text-mauve8">
        {index + 1}
      </kbd>
    </DropdownMenu.CheckboxItem>
  );
};

export default FolderItem;
