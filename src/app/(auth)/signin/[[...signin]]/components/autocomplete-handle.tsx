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
      ? `https://typeahead.waow.tech/xrpc/app.bsky.actor.searchActorsTypeahead?q=${debouncedValue}&limit=10`
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
        <div className="border-shadow focus-within:outline-brand-primary flex items-center rounded-md outline-offset-2 focus-within:outline-2">
          <span className="text-text-secondary border-dashed-r h-11 content-center px-2">
            @
          </span>
          <Autocomplete.Input
            placeholder="alice.bsky.social"
            className="h-11 flex-1 px-1 outline-none!"
            required
            name="handle"
          />
        </div>
      </label>

      <Autocomplete.Portal>
        <Autocomplete.Positioner
          className="outline-hidden"
          sideOffset={10}
          align="start"
        >
          <Autocomplete.Popup
            className={`invisible w-(--anchor-width) ${profiles && profiles.length >= 1 && "visible"} scrollbar-width-thin bg-background-primary outline-border-interactive max-h-[min(var(--available-height),23rem)] max-w-(--available-width) scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-md py-2 shadow-lg shadow-gray-200 outline-1 dark:shadow-none`}
            aria-busy={isLoading || undefined}
          >
            <Autocomplete.Status>
              {status && (
                <div className="text-secondary flex items-center gap-2 py-1 pr-8 pl-4 text-sm">
                  {status}
                </div>
              )}
            </Autocomplete.Status>
            <Autocomplete.List>
              {(profile: Profile) => (
                <Autocomplete.Item
                  key={profile.did}
                  className="group data-highlighted:before:bg-brand-primary flex cursor-default py-2 pr-8 pl-4 text-base leading-4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm"
                  value={profile}
                >
                  <span className="flex w-full items-center gap-2">
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
