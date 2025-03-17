import { SpinnerRotate } from "@/components/SpinnerRotate";

export default function LoadingUI() {
  return (
    <div className="absolute inset-0 left-[240px] flex items-center justify-center">
      <SpinnerRotate />
    </div>
  );
}
