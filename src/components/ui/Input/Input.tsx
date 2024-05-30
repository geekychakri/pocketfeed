import { ComponentProps, forwardRef } from "react";

export default forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function Input({ ...rest }, ref) {
    return (
      <input
        ref={ref}
        className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
        {...rest}
      />
    );
  }
);
