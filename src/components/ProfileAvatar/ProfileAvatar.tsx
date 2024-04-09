import { ReactElement, ReactNode } from "react";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  PersonIcon,
  GearIcon,
  PaperPlaneIcon,
  HeartIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

const AvatarDropdownItem = ({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactElement;
}) => (
  <DropdownMenu.Item className="leading-none text-sm rounded-[3px] flex items-center gap-2 h-[25px] px-2 py-5 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 text-[#555] data-[highlighted]:text-black duration-150">
    <span>{icon}</span>
    {children}
  </DropdownMenu.Item>
);

export default function ProfileAvatar() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="bg-blackA1 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
          <Avatar.Image
            className="h-full w-full rounded-[inherit] object-cover border-2"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
            alt="Colm Tuite"
          />
          <Avatar.Fallback
            className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
            delayMs={600}
          >
            CT
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-white rounded-md p-[5px] shadow-[0px_8px_30px_rgba(0,0,0,.12)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade border"
          sideOffset={5}
          align="end"
        >
          <AvatarDropdownItem icon={<PersonIcon />}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem icon={<GearIcon />}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="h-[1px] bg-[#eee] my-[5px]" />
          <AvatarDropdownItem icon={<PaperPlaneIcon />}>
            <span>Feedback</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem icon={<HeartIcon />}>
            <span>Upgrade</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem icon={<ExitIcon />}>
            <span>Sign out</span>
          </AvatarDropdownItem>
          <DropdownMenu.Arrow className="fill-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
