import { ComponentProps, ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "delete" | "cta";
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
        "h-11 cursor-pointer rounded-md px-4 py-2 font-medium transition-[background-color,opacity]",
        variant === "delete" ? "hover:opacity-90" : "hover:bg-ui-hover",
        variant === "cta"
          ? "bg-cta text-background-primary hover:bg-cta-hover"
          : "bg-ui-normal",
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
