import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText?: string;
}

const MAX_CHARS = 300;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, labelText, ...props }, ref) => {
    const [text, setText] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };
    return (
      <div className="border-shadow focus-within:outline-brand-primary rounded-md focus-within:outline-2 focus-within:outline-offset-2">
        <label
          htmlFor="custom-textarea"
          className="text-text-secondary border-dashed-b flex items-center justify-between p-1 px-2 text-sm"
        >
          <span>{labelText}</span>
          <span className={text.length > 300 ? "text-danger" : "tabular-nums"}>
            {MAX_CHARS - text.length}
          </span>
        </label>
        <textarea
          id="custom-textarea"
          autoCapitalize="sentences"
          onChange={handleChange}
          value={text}
          // maxLength={300}
          autoComplete="on"
          autoCorrect="on"
          dir="auto"
          spellCheck
          ref={ref}
          className={cn(
            "w-full resize-none rounded-md border-none bg-transparent px-4 py-2 outline-none!",
            className,
          )}
          {...props}
        />

        {text.length > 300 && (
          <p className="text-danger border-dashed-t p-1 px-4 text-sm font-medium">
            Maximum characters limit exceeded!
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
