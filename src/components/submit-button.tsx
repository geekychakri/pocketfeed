"use client";

import { ComponentProps, forwardRef, ReactNode } from "react";

import { useFormStatus } from "react-dom";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { cn } from "@/lib/utils";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

// export default function SubmitButton({ text }: { text: string }) {
//   const { pending } = useFormStatus();
//   return (
//     <button
//       className="flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white"
//       disabled={pending}
//     >
//       {pending ? <SpinnerRotate /> : text}
//     </button>
//   );
// }

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function SubmitButton({ icon, children, className, ...rest }, ref) {
  const { pending } = useFormStatus();
  return (
    <button
      ref={ref}
      className={cn(
        "bg-ui-normal hover:bg-ui-hover flex h-12 w-[160px] items-center justify-center rounded-md px-4 py-2 font-medium",
        className,
      )}
      aria-disabled={pending}
      {...rest}
    >
      {icon}
      {pending ? <SpinnerRotate /> : children}
    </button>
  );
});
