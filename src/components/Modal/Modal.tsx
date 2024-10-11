import React, { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
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
  console.log({ open });
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
    <DialogPrimitive.Overlay className="fixed inset-0 bg-[#ffffffcc] backdrop-blur-[3px] data-[state=open]:animate-overlayShow" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[#ededed] bg-[#f7f7f8] py-[25px] shadow-[0_8px_30px_0px_rgba(0,0,0,0.12)] focus:outline-none data-[state=open]:animate-contentShow"
    >
      <div className="mb-[16px] flex items-center justify-between px-[25px]">
        <DialogPrimitive.Title className="text-lg font-medium">
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
