import { ComponentProps, ReactNode, forwardRef } from "react";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
};

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function Button({ icon, children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className="bg-primary font-medium text-white px-4 py-2 rounded-md"
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});
