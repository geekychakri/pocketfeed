"use client";

import { useFormStatus } from "react-dom";

import { SpinnerRotate } from "../SpinnerRotate";

export default function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white"
      disabled={pending}
    >
      {pending ? <SpinnerRotate /> : text}
    </button>
  );
}
