import { ComponentProps, ReactNode, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function Button({ icon, children, className, ...rest }, ref) {
  // const { pending } = useFormStatus();
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-11 w-full items-center justify-center rounded-md border px-4 py-2 font-medium text-white",
        className,
      )}
      // disabled={pending}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});
