"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { SpinnerRotate } from "@/components/spinner-rotate";
import CustomButton from "@/components/ui/custom-button";

import LastBskyFollowsSyncedAt from "./last-bsky-follows-sync";

class StatusError extends Error {
  info: string | undefined;
  status: number | undefined;
}

const mutationFetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "POST",
  });

  if (!res.ok) {
    const error = new StatusError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function ManualSyncBskyFollows() {
  const { trigger, isMutating } = useSWRMutation(
    "/api/sync-bsky-follows?force=true",
    mutationFetcher,
    {
      onSuccess: () => {
        mutate("/api/last-bsky-follows-sync");
        toast.success("Successfully synced!");
      },
      onError: () => {
        toast.error("Something went wrong!");
      },
    },
  );

  return (
    <div className="border-dashed-b flex flex-col gap-3 p-4">
      <h2 className="text-brand-primary font-medium">Bluesky Follows Sync</h2>
      <p className="text-text-secondary">
        Pocket Feed automatically syncs your Bluesky follows once a day. Sync
        now to automatically follow people you already follow on Bluesky who are
        also using Pocket Feed.
      </p>
      <CustomButton
        onClick={() => trigger()}
        className="flex items-center justify-center gap-2"
      >
        Sync Now {isMutating && <SpinnerRotate />}
      </CustomButton>
      <LastBskyFollowsSyncedAt />
    </div>
  );
}
