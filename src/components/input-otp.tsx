"use client";
import { OTPInput, SlotProps } from "input-otp";

import { cn } from "@/lib/utils";

type InputOTPProps = {
  onInputOTPChange: (val: string) => void;
};

export default function InputOTP({ onInputOTPChange }: InputOTPProps) {
  return (
    <OTPInput
      autoFocus
      maxLength={6}
      inputMode="numeric"
      containerClassName="group flex items-center self-center has-disabled:opacity-30"
      onComplete={() => console.log("COMPLETED")}
      onChange={(val) => onInputOTPChange(val)}
      render={({ slots }) => (
        <div className="flex">
          {slots.slice(0, 6).map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  );
}

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative h-14 w-10 text-[2rem]",
        "flex items-center justify-center",
        "transition-all",
        "border-ui-normal border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
        // "group-focus-within:border-red-800 group-hover:border-red-400",
        "outline-brand-primary outline outline-0",
        { "outline-1": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-px bg-current" />
    </div>
  );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="bg-border h-1 w-3 rounded-full" />
    </div>
  );
}
