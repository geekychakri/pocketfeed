"use client";

import {
  BookmarkIcon,
  MoonIcon,
  PersonIcon,
  SectionIcon,
  SunIcon,
} from "@radix-ui/react-icons";

import ThemeSwitcher from "@/components/theme-switcher";

export default function ArticleSettings() {
  return (
    <div className="border-border-primary fixed top-1/2 left-[300px] flex -translate-y-1/2 flex-col gap-6 rounded-md border px-2 py-4">
      <ThemeSwitcher />
      <BookmarkIcon className="size-5" />
    </div>
  );
}
