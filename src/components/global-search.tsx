"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useDebouncedCallback } from "use-debounce";

import Input from "@/components/ui/custom-input";

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
    <div className="flex flex-col gap-6">
      <div>
        <span className="border-shadow flex items-center rounded-md duration-100 focus-within:shadow-[0_0_0_1px_#fc591e,0_0_0_1px_#fc591e] hover:shadow-[0_0_0_1px_#fc591e,0_0_0_1px_#fc591e]">
          <span className="p-2">
            <MagnifyingGlassIcon className="size-7" />
          </span>
          <Input
            className="flex-1 border-none p-2 focus-visible:shadow-none"
            id="password"
            required
            placeholder={`Search for ${category}`}
            name="password"
            defaultValue={searchParams.get("query")?.toString()}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </span>
      </div>

      <div className="border-border-non-interactive flex gap-4 border-b border-dashed py-3">
        <Link
          href="/search/feeds"
          className={
            pathname === "/search/feeds"
              ? "text-brand-primary"
              : "text-text-secondary"
          }
        >
          Feeds
        </Link>
        <Link
          href="/search/users"
          className={
            pathname === "/search/users"
              ? "text-brand-primary"
              : "text-text-secondary"
          }
        >
          Users
        </Link>
      </div>
    </div>
  );
}
