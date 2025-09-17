import { useState, useEffect } from "react";

import { useTheme } from "next-themes";

import {
  SectionIcon,
  BookmarkIcon,
  PersonIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <button onClick={() => setTheme("light")}>
        <SunIcon className="size-5" />
      </button>
      <button onClick={() => setTheme("dark")}>
        <MoonIcon className="size-5" />
      </button>
    </>
  );
}
