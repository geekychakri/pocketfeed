"use client";

import * as React from "react";

import { Autocomplete } from "@base-ui/react/autocomplete";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import { fetcher, getInitials } from "@/lib/utils";

interface Profile {
  did: string;
  handle: string;
  displayName: string;
  avatar: string;
}

interface Actors {
  actors: Profile[];
}

export default function AutocompleteHandle() {
  const [debouncedValue, setDebounceValue] = React.useState("");

  const { data, isLoading, error } = useSWR<Actors>(
    debouncedValue.length > 1
      ? `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${debouncedValue}&limit=10`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  function getStatus(): React.ReactNode | null {
    if (error) {
      return null;
    }

    if (debouncedValue === "") {
      return null;
    }
  }

  const status = getStatus();

  const profiles = debouncedValue.length > 1 ? data?.actors : [];

  const debouncedSearch = useDebouncedCallback(async (value) => {
    setDebounceValue(value);
  }, 300);

  console.log({ debouncedValue });

  const handleOnValueChange = async (nextSearchValue: string) => {
    // setSearchValue(nextSearchValue);
    console.log({ nextSearchValue });
    debouncedSearch(nextSearchValue);
  };

  return (
    <Autocomplete.Root
      items={profiles}
      // value={searchValue}
      onValueChange={handleOnValueChange}
      itemToStringValue={(item) => item.handle}
      filter={null}
      onOpenChangeComplete={() => {
        console.log("complete");
        debouncedSearch("");
      }}
    >
      <label className="flex flex-col gap-1 text-sm leading-5 font-medium">
        Handle
        <div className="flex items-center border-shadow rounded-md focus-within:outline-2 focus-within:outline-brand-primary">
          <span className="px-2 h-11 content-center text-text-secondary border-dashed-r">
            @
          </span>
          <Autocomplete.Input
            placeholder="alice.bsky.social"
            className="h-11 flex-1 px-1 outline-none custom-caret"
            required
            name="handle"
          />
        </div>
      </label>

      <Autocomplete.Portal>
        <Autocomplete.Positioner
          className="outline-hidden"
          sideOffset={4}
          align="start"
        >
          <Autocomplete.Popup
            className={`w-(--anchor-width) invisible ${profiles && profiles.length >= 1 && "visible"}  scrollbar-width-thin max-h-[min(var(--available-height),23rem)] max-w-(--available-width) overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain rounded-md bg-background-primary py-2 shadow-lg shadow-gray-200 outline-1 outline-border-interactive dark:shadow-none`}
            aria-busy={isLoading || undefined}
          >
            <Autocomplete.Status>
              {status && (
                <div className="flex items-center gap-2 py-1 pl-4 pr-8 text-sm text-secondary">
                  {status}
                </div>
              )}
            </Autocomplete.Status>
            <Autocomplete.List>
              {(profile: Profile) => (
                <Autocomplete.Item
                  key={profile.did}
                  className="flex cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-hidden select-none group data-highlighted:text-white data-highlighted:relative data-highlighted:z-0  data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-brand-primary"
                  value={profile}
                >
                  <span className="flex items-center w-full gap-2">
                    <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-8 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none group-hover:ring-2">
                      <AvatarImage
                        className="h-full w-full rounded-[inherit] object-cover"
                        src={profile.avatar}
                        alt={profile.displayName || profile.handle}
                      />
                      <AvatarFallback
                        // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
                        delayMs={600}
                      >
                        {getInitials(profile.displayName || profile.handle)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm leading-4">{profile.handle}</span>
                  </span>
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
