import { ComponentProps, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        autoCapitalize="sentences"
        autoComplete="on"
        autoCorrect="on"
        dir="auto"
        spellCheck
        ref={ref}
        className={cn(
          "border-shadow resize-none rounded-md border-none bg-transparent px-4 py-2 outline-none! transition",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
