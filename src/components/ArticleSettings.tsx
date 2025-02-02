"use client";

import {
  SectionIcon,
  BookmarkIcon,
  PersonIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";

import ThemeSwitcher from "./ThemeSwitcher";

export default function ArticleSettings() {
  return (
    <div className="fixed left-[300px] top-1/2 flex -translate-y-1/2 flex-col gap-6 rounded-md border border-border-primary px-2 py-4">
      <ThemeSwitcher />
      <BookmarkIcon className="size-5" />
    </div>
  );
}
