"use client";

import { useEffect } from "react";

export default function SyncBskyFollows() {
  useEffect(() => {
    void fetch("/api/sync-bsky-follows", {
      method: "POST",
    }).catch(console.error);
  }, []);

  return null;
}
