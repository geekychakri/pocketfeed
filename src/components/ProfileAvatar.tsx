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
      // className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-[25px] items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none duration-150 select-none data-disabled:pointer-events-none data-highlighted:shadow-none"
      className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-[25px] cursor-pointer items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none duration-150 outline-none select-none data-disabled:pointer-events-none"
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
        <button className="flex w-full cursor-pointer items-center gap-2 rounded-full">
          <Avatar className="hover:ring-ui-normal ring-ui-normal inline-flex h-[35px] w-[35px] flex-none items-center justify-center overflow-hidden rounded-full align-middle ring-1 duration-150 select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={avatarUrl}
              alt={username}
            />
            <AvatarFallback
              className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <span className="text-text-secondary truncate text-sm font-medium">
            {username}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="border-shadow bg-background-primary text-text-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-40 min-w-[180px] rounded-md p-[5px]"
          sideOffset={11}
          align="start"
        >
          <AvatarDropdownItem to={`/user/${username}`} Icon={UserIcon}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/settings" Icon={SettingsGearIcon}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="bg-border-non-interactive my-[5px] h-[1px]" />
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
