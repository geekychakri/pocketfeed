import React, { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  // console.log({ open });
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ title, children, className, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-120 bg-black/80 backdrop-blur-[1px] data-[state=open]:animate-overlayShow" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={cn(
        "fixed left-[50%] top-[50%] z-130 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg py-[25px] shadow-[0_8px_30px_0px_rgba(0,0,0,0.12)] focus:outline-none data-[state=open]:animate-contentShow",
        className,
      )}
    >
      <div className="px-[25px]">
        <DialogPrimitive.Title className="mb-4 text-lg font-medium">
          {title}
        </DialogPrimitive.Title>
      </div>

      {children}
      <DialogPrimitive.Close asChild>
        <button
          className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-text-primary hover:bg-ui-hover focus:outline-none"
          aria-label="Close"
        >
          <Cross2Icon />
        </button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mb-5 px-[25px] text-sm", className)}
    {...props}
  />
));

ModalDescription.displayName = DialogPrimitive.Description.displayName;

ModalContent.displayName = DialogPrimitive.Content.displayName;

Modal.Button = DialogPrimitive.Trigger;
Modal.Close = DialogPrimitive.Close;
Modal.Content = ModalContent;
Modal.Description = ModalDescription;
