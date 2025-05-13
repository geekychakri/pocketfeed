import { ComponentProps, ReactNode, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: string;
};

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function Button({ icon, variant, children, className, ...rest }, ref) {
  // const { pending } = useFormStatus();
  return (
    <button
      ref={ref}
      className={cn(
        "bg-ui-normal h-12 cursor-pointer gap-3 rounded-md px-4 py-2 font-medium text-[#eee] transition-[background-color] dark:text-[#202020]",
        variant === "delete" ? "hover:opacity-90" : "hover:bg-ui-hover",
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
