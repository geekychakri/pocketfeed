import { ComponentProps, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "rounded-md border px-4 py-2 outline-none duration-150 hover:border-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
