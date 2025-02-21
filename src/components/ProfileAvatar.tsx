"use client";

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

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";
import SignOutButton from "@/components/SignOutButton";
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
        className="relative flex h-[25px] select-none items-center gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-text-primary outline-none duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-normal data-[disabled]:text-mauve8"
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
  // console.log({ username });
  // console.log({ avatarUrl });
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full">
          <Avatar className="inline-flex h-[35px] w-[35px] flex-none cursor-pointer select-none items-center justify-center overflow-hidden rounded-full align-middle duration-150 hover:ring-4 hover:ring-ui-normal">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={avatarUrl}
              alt={username}
            />
            <AvatarFallback
              className="leading-1 flex h-full w-full items-center justify-center bg-ui-normal text-[15px] font-medium"
              delayMs={600}
            >
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium text-text-secondary">
            {username}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-40 min-w-[180px] rounded-md border border-ui-normal bg-background-primary p-[5px] text-text-primary will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={11}
          align="start"
        >
          <AvatarDropdownItem to={`/user/${username}`} Icon={UserIcon}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/settings" Icon={SettingsGearIcon}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="my-[5px] h-[1px] bg-border-non-interactive" />
          <AvatarDropdownItem to="/feedback" Icon={MessageCircleIcon}>
            <span>Feedback</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/pricing" Icon={PartyPopperIcon}>
            <span>Upgrade</span>
          </AvatarDropdownItem>

          <SignOutButton />

          <DropdownMenu.Arrow className="fill-brand-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
