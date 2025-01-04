import { SpinnerRotate } from "@/components/SpinnerRotate";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <SpinnerRotate />
    </div>
  );
}
