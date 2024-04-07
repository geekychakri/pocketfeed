import { useHotkeys } from "react-hotkeys-hook";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useRouter } from "next/navigation";

import { CheckIcon } from "@radix-ui/react-icons";

const FolderItem = ({
  folder,
  index,
  selectedFolder,
  setSelectedFolder,
}: {
  folder: string;
  index: number;
  selectedFolder: string;
  setSelectedFolder: (item: string) => void;
}) => {
  const router = useRouter();
  const shortcutKey = index + 1;
  useHotkeys(shortcutKey.toString(), async () => {
    router.push(`/geeky/${folder}`);
    setSelectedFolder(folder);
  });

  const handleSelectFolder = (item: string) => {
    setSelectedFolder(item === selectedFolder ? "Home" : item); //TODO:
    router.push(`/geeky/${item}`);
  };

  return (
    <DropdownMenu.CheckboxItem
      checked={folder === selectedFolder}
      onSelect={() => handleSelectFolder(folder)}
      className="group text-[14px] leading-none rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet1 group py-4"
      key={index}
    >
      <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="text-primary group-hover:text-white" />
      </DropdownMenu.ItemIndicator>
      {folder}{" "}
      <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
        {index + 1}
      </div>
    </DropdownMenu.CheckboxItem>
  );
};

export default FolderItem;
