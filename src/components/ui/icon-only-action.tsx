import { ComponentProps, ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

type IconOnlyActionProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      as?: "button";
      className?: string;
      children?: ReactNode;
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: "a";
      className?: string;
      children?: ReactNode;
    });

export default forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconOnlyActionProps
>(function IconOnlyAction(props: IconOnlyActionProps, ref) {
  if (props.as === "a") {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...props}
        className={cn(
          "relative flex size-6 items-center justify-center rounded-full",
          props.className,
        )}
      >
        <span className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 bg-blue-100/20 pointer-fine:hidden"></span>
        {props.children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      {...props}
      className={cn(
        "relative flex size-6 cursor-pointer items-center justify-center",
        props.className,
      )}
    >
      <span className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"></span>
      {props.children}
    </button>
  );
});
