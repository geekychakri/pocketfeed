"use client";

import { useRef, useEffect, useState, useActionState } from "react";
import { useFormState } from "react-dom";
import { UsersRecord } from "@/xata";

import { updateProfile } from "@/app/actions";

import useSound from "use-sound";

import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { SpinnerRotate } from "../SpinnerRotate";
import Button from "../ui/Button";
import { toastError } from "@/lib/utils";

import type { updateProfileActionResponse } from "@/types";

const initialState: updateProfileActionResponse = {
  type: "",
  message: "",
};

export default function ProfileForm({ userInfo }: { userInfo: UsersRecord }) {
  const [playSuccess] = useSound("sounds/success.wav");
  const [playCaution] = useSound("sounds/caution.wav");

  const { fullname, website, bio, birthday } = userInfo as UsersRecord;

  const [formState, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  useEffect(() => {
    if (formState?.type === "success") {
      console.log("state msg");
      playSuccess();
      toast.success(formState?.message);
    } else if (formState?.type === "error") {
      playCaution();
      toastError(formState?.message);
    }
  }, [formState]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-text-secondary text-xl">Profile</h2>

      <form action={formAction} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullname" className="font-medium">
            Fullname
          </label>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="John Doe"
            defaultValue={formState?.inputs?.fullname || fullname || ""}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="website" className="font-medium">
              Website
            </label>
            {formState?.errors?.website && (
              <p aria-live="polite" className="text-danger text-sm">
                {formState.errors.website[0]}
              </p>
            )}
          </div>
          <Input
            type="text"
            id="website"
            name="website"
            placeholder="johndoe.com"
            defaultValue={formState?.inputs?.website || website || ""}
            spellCheck={false}
            className={formState?.errors?.website ? "border-shadow-error" : ""}
          />
        </div>

        <ProfileBio bio={bio as string} formState={formState} />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="birthday" className="font-medium">
              Birthday
            </label>
            {formState?.errors?.birthday && (
              <p aria-live="polite" className="text-danger text-sm">
                {formState.errors.birthday[0]}
              </p>
            )}
          </div>
          <Input
            type="date"
            id="birthday"
            name="birthday"
            defaultValue={formState?.inputs?.birthday || birthday || ""}
            spellCheck={false}
            className={formState?.errors?.birthday ? "border-shadow-error" : ""}
          />
        </div>

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

function ProfileBio({
  bio,
  formState,
}: {
  bio: string;
  formState: updateProfileActionResponse;
}) {
  const MAX_TEXT_LENGTH = 160;
  const [text, setText] = useState(bio?.replace(/\r\n|\r/g, "\n") || "");
  const [characterLimitReached, setCharacterLimitReached] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
    if (e.currentTarget.value.length > MAX_TEXT_LENGTH) {
      setCharacterLimitReached(true);
    } else {
      setCharacterLimitReached(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center justify-between">
        <label htmlFor="bio" className="font-medium">
          Bio <span className="sr-only">, Max 160 characters allowed.</span>
        </label>

        {formState?.errors?.bio && characterLimitReached ? (
          <p aria-live="polite" className="text-danger text-sm">
            {formState.errors.bio[0]}
          </p>
        ) : (
          <p
            className="text-danger text-sm [grid-area:1/-1]"
            aria-live="polite"
          >
            {characterLimitReached ? (
              "Bio must be 160 characters or less."
            ) : (
              <>&#8203;</>
            )}
          </p>
        )}

        <p aria-live="assertive" className="sr-only">
          {text.length === 155 ? (
            "You have 5 characters remaining."
          ) : (
            <>&#8203;</>
          )}
        </p>

        <span className={`text-sm tabular-nums`}>
          <span
            className={
              text.length > MAX_TEXT_LENGTH
                ? "text-danger"
                : "text-text-secondary"
            }
          >
            {text?.length}
          </span>{" "}
          / <span className="text-text-secondary">{MAX_TEXT_LENGTH}</span>
        </span>
      </span>
      <Textarea
        id="bio"
        name="bio"
        className={`min-h-24 scroll-pb-2 ${formState?.errors?.bio ? "border-shadow-error" : ""} ${characterLimitReached ? "text-danger" : ""}`}
        placeholder="Builds stuff for the web!"
        // defaultValue={bio || ""}
        // maxLength={MAX_TEXT_LENGTH}
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}
