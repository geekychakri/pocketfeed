"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useDebouncedCallback } from "use-debounce";

import Input from "@/components/ui/custom-input";

import { cn } from "@/lib/utils";

export default function GlobalSearch({ category }: { category: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const [text, setText] = useState("");
  // const [value] = useDebounce(text, 1000);

  // const [feeds, setFeeds] = useState([]);

  console.log({ pathname });

  const handleSearch = useDebouncedCallback(async (term: string) => {
    const params = new URLSearchParams(searchParams);
    console.log({ term });
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    // const res = await fetch("/api/search", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({ search: value }),
    // });
    // const data = await res.json();
    // console.log(data);
    // setFeeds(data);
  }, 300);

  useEffect(() => {
    // if (!value) {
    //   setFeeds([]);
    //   return;
    // }
    // handleSubmit();
  }, []);

  //   console.log(typeof feeds);

  return (
    <div className="flex flex-col">
      <div>
        <span className="border-y px-3 h-14 flex items-center duration-100 focus-within:shadow-[0_1px_0_0_#fc591e] hover:shadow-[0_1px_0_0_#fc591e]">
          <span className="p-2">
            <MagnifyingGlassIcon className="size-7" />
          </span>
          <Input
            className="flex-1 shadow-none! p-2 focus-visible:shadow-none focus-visible:outline-none"
            id="password"
            required
            placeholder={`Search for ${category}`}
            name="password"
            spellCheck="false"
            defaultValue={searchParams.get("query")?.toString()}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </span>
      </div>

      <div className="border-border-non-interactive border-b flex p-3">
        <Link
          href="/search/feeds"
          className={cn(
            pathname === "/search/feeds"
              ? "text-brand-primary"
              : "text-text-secondary",
            "px-4 py-2",
          )}
        >
          Feeds
        </Link>
        <Link
          href="/search/users"
          className={cn(
            pathname === "/search/users"
              ? "text-brand-primary"
              : "text-text-secondary",
            "px-4 py-2",
          )}
        >
          Users
        </Link>
      </div>
    </div>
  );
}
