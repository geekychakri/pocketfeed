"use client";

import { useRef, useEffect, useState, useActionState } from "react";
import { useFormState } from "react-dom";
import { UsersRecord } from "@/xata";

import { updateProfile } from "@/app/actions";

import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { SpinnerRotate } from "../SpinnerRotate";
import Button from "../ui/Button";

const initialState = {
  type: "",
  message: "",
};

export default function ProfileForm({ userInfo }: { userInfo: UsersRecord }) {
  // const { userId }: { userId: string | null } = auth();
  // console.log({ userId });
  // const user = await xata.db.users.filter({ userId: userId }).getFirst();

  const datePickerParentRef = useRef<HTMLDivElement | null>(null);

  const { username, email, fullname, website, bio, birthday } =
    userInfo as UsersRecord;

  const [formState, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  useEffect(() => {
    if (formState?.type === "success") {
      console.log("state msg");
      toast.success(formState?.message);
    } else if (formState.type === "error") {
      toast.error(formState?.message);
    }
  }, [formState]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-text-secondary text-xl">Profile</h2>

      <form action={formAction} className="flex flex-col gap-6">
        {/* <label htmlFor="username" className="flex flex-col gap-2">
        <span className="font-medium">Username</span>
        <input
          type="text"
          id="username"
          placeholder="john@doe.com"
          defaultValue={username || ""}
          className="rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
        />
      </label>
      <label htmlFor="email" className="flex flex-col gap-2">
        <span className="font-medium">Email address</span>
        <input
          type="email"
          id="email"
          placeholder="john@doe.com"
          defaultValue={email || ""}
          className="rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
        />
      </label> */}
        <label htmlFor="fullname" className="flex flex-col gap-2">
          <span className="font-medium">Full name</span>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="John Doe"
            defaultValue={fullname || ""}
            spellCheck={false}
            // className="rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
          />
        </label>
        <label htmlFor="website" className="flex flex-col gap-2">
          <span className="font-medium">Website</span>
          <Input
            type="text"
            id="website"
            name="website"
            placeholder="johndoe.com"
            defaultValue={website || ""}
            spellCheck={false}
          />
        </label>
        {/* <label htmlFor="bio" className="flex flex-col gap-2">
        <span className="font-medium">Bio</span>
        <Textarea
          id="bio"
          name="bio"
          className="min-h-24 max-w-full scroll-pb-2"
          placeholder="I love reading blogs..."
          defaultValue={bio || ""}
          maxLength={160}
        />
      </label> */}
        <ProfileBio bio={bio as string} />
        <label htmlFor="birthday" className="flex flex-col gap-2">
          <span className="font-medium">Birthday</span>

          <Input
            type="date"
            id="birthday"
            name="birthday"
            defaultValue={birthday || ""}
            spellCheck={false}
          />
        </label>
        {/* <button className="rounded-md bg-primary px-4 py-2 font-medium text-white">
        Save
      </button> */}
        {/* <SubmitButton>Save</SubmitButton> */}
        <Button
          type="submit"
          aria-disabled={isPending}
          className="flex h-11 cursor-pointer items-center justify-center rounded-md"
        >
          <span>{isPending ? <SpinnerRotate /> : "Save"}</span>
        </Button>
      </form>
    </div>
  );
}

function ProfileBio({ bio }: { bio: string }) {
  const MAX_TEXT_LENGTH = 160;
  const [text, setText] = useState(bio.replace(/\r\n|\r/g, "\n"));

  // console.log({ bio });
  // console.log({ text });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };
  return (
    <label htmlFor="bio" className="flex flex-col gap-2">
      <span className="flex justify-between">
        <span className="font-medium">Bio</span>
        <span className="text-text-secondary text-sm tabular-nums">
          {text.length} / {MAX_TEXT_LENGTH}
        </span>
      </span>
      <Textarea
        id="bio"
        name="bio"
        className="min-h-24 scroll-pb-2"
        placeholder="I love reading blogs..."
        // defaultValue={bio || ""}
        maxLength={MAX_TEXT_LENGTH}
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
