import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from "@radix-ui/react-icons";
import { useHotkeys } from "react-hotkeys-hook";

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
      className="group data-disabled:text-mauve8 relative flex h-[25px] items-center rounded-[3px] px-[5px] py-4 pl-[25px] text-[14px] leading-none outline-none select-none data-disabled:pointer-events-none data-highlighted:bg-gray-100"
      key={index}
    >
      <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon className="text-primary" />
      </DropdownMenu.ItemIndicator>
      {folder}{" "}
      <kbd className="text-mauve11 group-data-disabled:text-mauve8 ml-auto pl-[20px] duration-150 group-data-highlighted:text-black">
        {index + 1}
      </kbd>
    </DropdownMenu.CheckboxItem>
  );
};

export default FolderItem;
