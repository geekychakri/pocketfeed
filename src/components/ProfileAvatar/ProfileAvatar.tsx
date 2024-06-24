import { ReactElement, ReactNode } from "react";

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

const AvatarDropdownItem = ({
  to,
  children,
  icon,
}: {
  to: string;
  children: ReactNode;
  icon: ReactElement;
}) => (
  <Link href={to}>
    <DropdownMenu.Item className="relative flex h-[25px] select-none items-center gap-2 rounded-[3px] px-2 py-5 text-sm leading-none text-[#555] outline-none duration-150 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:text-mauve8 data-[highlighted]:text-black">
      <span>{icon}</span>
      {children}
    </DropdownMenu.Item>
  </Link>
);

export default function ProfileAvatar() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar className="inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
          <AvatarImage
            className="h-full w-full rounded-[inherit] border-2 object-cover"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
            alt="Colm Tuite"
          />
          <AvatarFallback
            className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
            delayMs={600}
          >
            CT
          </AvatarFallback>
        </Avatar>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] rounded-md border bg-white p-[5px] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
          align="end"
        >
          <AvatarDropdownItem to={`/user/geeky`} icon={<PersonIcon />}>
            <span>Profile</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/settings" icon={<GearIcon />}>
            <span>Settings</span>
          </AvatarDropdownItem>
          <DropdownMenu.Separator className="my-[5px] h-[1px] bg-[#eee]" />
          <AvatarDropdownItem to="/feedback" icon={<PaperPlaneIcon />}>
            <span>Feedback</span>
          </AvatarDropdownItem>
          <AvatarDropdownItem to="/pricing" icon={<HeartIcon />}>
            <span>Upgrade</span>
          </AvatarDropdownItem>

          <SignOutButton />

          <DropdownMenu.Arrow className="fill-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
