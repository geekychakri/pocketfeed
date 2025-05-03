"use client";

import {
  ReactElement,
  ReactNode,
  useState,
  ComponentType,
  useRef,
} from "react";

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
import { MessageCircleMoreIcon } from "@/icons/animated/MessageCircleMoreIcon";
import { PartyPopperIcon } from "@/icons/animated/PartyPopperIcon";
import { getInitials } from "@/lib/utils";

import type {
  HTMLAttributes,
  RefAttributes,
  MutableRefObject,
  ForwardRefExoticComponent,
} from "react";
import { LogoutIcon } from "@/icons/animated/LogoutIcon";

interface UserIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number;
}
interface UserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}
const AvatarDropdownItem = ({
  to,
  children,
  Icon,
}: {
  to: string;
  children: ReactNode;
  Icon: ForwardRefExoticComponent<
    UserIconProps & RefAttributes<UserIconHandle>
  >;
}) => {
  const [hovered, setHovered] = useState(false);

  const iconRef = useRef<UserIconHandle>(null);
  return (
    <DropdownMenu.Item
      className="relative flex h-[25px] select-none items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-text-primary duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-normal data-[disabled]:text-mauve8 data-[highlighted]:shadow-none"
      asChild
      // onMouseEnter={() => iconRef.current?.startAnimation()}
      // onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <Link
        href={to}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        {/* <Icon data-hovered={hovered} /> */}
        {children}
        <Icon ref={iconRef} />
      </Link>
    </DropdownMenu.Item>
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
    <DropdownMenu.Root modal={false}>
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
          <AvatarDropdownItem to="/feedback" Icon={MessageCircleMoreIcon}>
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
