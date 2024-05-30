import React, { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ title, children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="bg-[#ffffffcc] data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-[3px]" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white border border-[#ededed] shadow-[0_8px_30px_0px_rgba(0,0,0,0.12)] p-[25px] focus:outline-none"
    >
      <div className="flex items-center justify-between">
        <DialogPrimitive.Title className="text-lg">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Close aria-label="Close">
          <Cross1Icon />
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

ModalContent.displayName = DialogPrimitive.Content.displayName;

Modal.Button = DialogPrimitive.Trigger;
Modal.Close = DialogPrimitive.Close;
Modal.Content = ModalContent;
