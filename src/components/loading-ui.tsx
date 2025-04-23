"use client";
import { usePathname } from "next/navigation";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import { useFullscreen } from "@/store/read-fullscreen";

export default function LoadingUI() {
  const pathname = usePathname();
  const { fullscreen } = useFullscreen();
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${fullscreen && pathname.startsWith("/read") ? "" : "left-[240px]"}`}
    >
      <SpinnerRotate />
    </div>
  );
}
