"use client";

import { useEffect, useRef } from "react";

import { toast } from "sonner";

import { useNavigatorOnline } from "@/hooks/useNavigatorOnline";

export default function CheckIsOnline() {
  const { isOffline, isOnline } = useNavigatorOnline();

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (isOffline) {
      toast.warning("You seem to be offline!", {
        id: "offline-toast",
        duration: Infinity,
      });
    } else if (isOnline) {
      toast.dismiss("offline-toast");
    }
  }, [isOffline, isOnline]);

  return null;
}
