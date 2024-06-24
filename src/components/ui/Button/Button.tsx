import { ComponentProps, ReactNode, forwardRef } from "react";
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
  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});
