import * as TooltipPrimitive from "@radix-ui/react-tooltip";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  "content"
>;

export function CustomTooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side="top"
        align="center"
        sideOffset={5}
        {...props}
        className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-2.5 py-1.25 text-[13px] leading-none font-medium select-none"
        // hideWhenDetached={true}
      >
        {content}
        {/* <TooltipPrimitive.Arrow
            width={11}
            height={5}
            className="fill-brand-primary"
          /> */}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
