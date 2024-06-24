import { ComponentProps, forwardRef } from "react";

export default forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function Input({ ...rest }, ref) {
    return (
      <input
        ref={ref}
        className="rounded-md border px-4 py-2 outline-none"
        {...rest}
      />
    );
  },
);
