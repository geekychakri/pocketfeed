import { SpinnerRotate } from "@/components/SpinnerRotate";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center bg-pink-300">
      <SpinnerRotate />
    </div>
  );
}
