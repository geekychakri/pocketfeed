"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { UsersRecord } from "@/xata";

import { updateProfile } from "@/app/actions";

import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const initialState = {
  message: "",
};

export default function ProfileForm({ userInfo }: { userInfo: UsersRecord }) {
  // const { userId }: { userId: string | null } = auth();
  // console.log({ userId });
  // const user = await xata.db.users.filter({ userId: userId }).getFirst();

  const { username, email, fullname, website, bio, birthday } =
    userInfo as UsersRecord;

  const [formState, formAction] = useFormState(updateProfile, initialState);

  useEffect(() => {
    if (formState?.message) {
      console.log("state msg");
      toast.error(formState?.message);
    }
  }, [formState]);

  return (
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
      <label htmlFor="bio" className="flex flex-col gap-2">
        <span className="font-medium">Bio</span>
        <Textarea
          id="bio"
          name="bio"
          className="min-h-24 scroll-pb-2 whitespace-pre"
          placeholder="I love reading blogs..."
          defaultValue={bio || ""}
          maxLength={160}
        />
      </label>
      <label htmlFor="birthday" className="flex flex-col gap-2">
        <span className="font-medium">Birthday</span>
        <Input
          type="date"
          id="birthday"
          name="birthday"
          defaultValue={birthday || ""}
          spellCheck={false}

          // className="rounded-md border px-4 py-2 outline-none duration-100 focus:border-primary"
        />
      </label>
      {/* <button className="rounded-md bg-primary px-4 py-2 font-medium text-white">
        Save
      </button> */}
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
