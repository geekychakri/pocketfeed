"use client";

import {
  ComponentType,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from "react";
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MutableRefObject,
  RefAttributes,
} from "react";
import type { Route } from "next";
import Link from "next/link";

// import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  GearIcon,
  HeartIcon,
  PaperPlaneIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import SignOutButton from "@/components/sign-out";

import { LogoutIcon } from "@/icons/animated/LogoutIcon";
import { MessageCircleMoreIcon } from "@/icons/animated/MessageCircleMoreIcon";
import { PartyPopperIcon } from "@/icons/animated/PartyPopperIcon";
import { SettingsGearIcon } from "@/icons/animated/SettingsGearIcon";
import { UserIcon } from "@/icons/animated/UserIcon";
import { getInitials } from "@/lib/utils";

interface UserIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number;
}
interface UserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type AvatarDropdownItemProps<T extends string = string> = {
  href: Route<T> | URL;
  children: ReactNode;
  Icon: ForwardRefExoticComponent<
    UserIconProps & RefAttributes<UserIconHandle>
  >;
};

const AvatarDropdownItem = ({
  href,
  children,
  Icon,
}: AvatarDropdownItemProps) => {
  const [hovered, setHovered] = useState(false);

  const iconRef = useRef<UserIconHandle>(null);
  return (
    <DropdownMenu.Item
      // className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-[25px] items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none duration-150 select-none data-disabled:pointer-events-none data-highlighted:shadow-none"
      className="text-text-primary data-highlighted:bg-ui-normal data-disabled:text-mauve8 relative flex h-[25px] cursor-pointer items-center justify-between gap-2 rounded-[3px] px-2 py-5 text-sm leading-none focus-visible:outline-none! select-none data-disabled:pointer-events-none"
      asChild
      // onMouseEnter={() => iconRef.current?.startAnimation()}
      // onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <Link
        href={href}
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
  avatar,
  handle,
  displayName,
}: {
  avatar: string;
  handle: string;
  displayName: string;
}) {
  // console.log({ username });
  // console.log({ avatarUrl });
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="flex w-full cursor-pointer items-center gap-2 rounded-full">
          <Avatar className="hover:ring-ui-normal ring-ui-normal inline-flex size-[30px] flex-none items-center justify-center overflow-hidden rounded-full align-middle ring-1 duration-150 select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={avatar}
              alt={displayName}
            />
            <AvatarFallback
              className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(displayName || handle)}
            </AvatarFallback>
          </Avatar>
          <span className="text-text-secondary truncate text-sm font-medium">
            {displayName || handle}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="border-shadow bg-background-primary text-text-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-40 min-w-[220px] rounded-md p-[5px]"
          sideOffset={14}
          align="start"
        >
          <AvatarDropdownItem href={`/user/${handle}` as Route} Icon={UserIcon}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem href="/settings" Icon={SettingsGearIcon}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="bg-border-non-interactive my-[5px] h-[1px]" />
          <AvatarDropdownItem href="/feedback" Icon={MessageCircleMoreIcon}>
            <span>Feedback</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem href="/pricing" Icon={PartyPopperIcon}>
            <span>Upgrade</span>
          </AvatarDropdownItem>

          <SignOutButton />

          <DropdownMenu.Arrow className="fill-brand-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
