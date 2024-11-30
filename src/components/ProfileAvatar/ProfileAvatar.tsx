import { ReactElement, ReactNode, useState, ComponentType } from "react";

import Link from "next/link";

// import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  PersonIcon,
  GearIcon,
  PaperPlaneIcon,
  HeartIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarImage, AvatarFallback } from "../UserAvatar";
import SignOutButton from "../SignOutButton";
import { UserIcon } from "@/icons/animated/UserIcon";
import { SettingsGearIcon } from "@/icons/animated/SettingsGearIcon";
import { MessageCircleIcon } from "@/icons/animated/MessageCircleIcon";
import { PartyPopperIcon } from "@/icons/animated/PartyPopperIcon";
import { getInitials } from "@/lib/utils";

const AvatarDropdownItem = ({
  to,
  children,
  Icon,
}: {
  to: string;
  children: ReactNode;
  Icon: ComponentType;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={to}>
      <DropdownMenu.Item
        className="relative flex h-[25px] select-none items-center gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-[#555] outline-none duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:text-mauve8 data-[highlighted]:text-black"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <Icon data-hovered={hovered} />
        {children}
      </DropdownMenu.Item>
    </Link>
  );
};

export default function ProfileAvatar({
  avatarUrl,
  username,
}: {
  avatarUrl: string;
  username: string;
}) {
  console.log({ username });
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Avatar className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
          <AvatarImage
            className="h-full w-full rounded-[inherit] border-2 object-cover"
            src={avatarUrl}
            alt={username}
          />
          <AvatarFallback
            className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
            delayMs={600}
          >
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-[10] min-w-[180px] rounded-md border bg-white p-[5px] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
          align="end"
        >
          <AvatarDropdownItem to={`/user/geeky`} Icon={UserIcon}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/settings" Icon={SettingsGearIcon}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="my-[5px] h-[1px] bg-[#eee]" />
          <AvatarDropdownItem to="/feedback" Icon={MessageCircleIcon}>
            <span>Feedback</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/pricing" Icon={PartyPopperIcon}>
            <span>Upgrade</span>
          </AvatarDropdownItem>

          <SignOutButton />

          <DropdownMenu.Arrow className="fill-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
