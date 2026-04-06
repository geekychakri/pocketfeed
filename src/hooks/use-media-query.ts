"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function getDevice(): "mobile" | "tablet" | "desktop" | null {
  if (typeof window === "undefined") return null;

  return window.matchMedia("(min-width: 1024px)").matches
    ? "desktop"
    : window.matchMedia("(min-width: 768px)").matches
      ? "tablet"
      : "mobile";
}

function getDimensions() {
  if (typeof window === "undefined") return null;

  return { width: window.innerWidth, height: window.innerHeight };
}

export function useMediaQuery() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(
    getDevice(),
  );
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(getDimensions());

  useEffect(() => {
    const checkDevice = () => {
      setDevice(getDevice());
      setDimensions(getDimensions());
    };

    // Initial detection
    checkDevice();

    // Listener for windows resize
    window.addEventListener("resize", checkDevice);

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
}

// import React from "react";

// export function useMediaQuery(query: string) {
//   const subscribe = useCallback(
//     (callback: () => void) => {
//       const matchMedia = window.matchMedia(query);

//       matchMedia.addEventListener("change", callback);
//       return () => {
//         matchMedia.removeEventListener("change", callback);
//       };
//     },
//     [query],
//   );

//   const getSnapshot = () => {
//     return window.matchMedia(query).matches;
//   };

//   const getServerSnapshot = () => {
//     throw Error("useMediaQuery is a client-only hook");
//   };

//   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
// }

// export function useMediaQuery(query: string) {
//   const subscribe = useCallback(
//     (callback: () => void) => {
//       const media = window.matchMedia(query);
//       media.addEventListener("change", callback);
//       return () => media.removeEventListener("change", callback);
//     },
//     [query],
//   );

//   const getSnapshot = () => {
//     return window.matchMedia(query).matches;
//   };

//   const getServerSnapshot = () => {
//     // Return a consistent fallback
//     return false;
//   };

//   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
// }
