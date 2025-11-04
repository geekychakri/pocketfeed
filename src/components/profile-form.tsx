"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { JSONData } from "@xata.io/client";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import useSound from "use-sound";

import { SpinnerRotate } from "@/components/spinner-rotate";
// import SubmitButton from "@/components/SubmitButton";
import Button from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";
import Textarea from "@/components/ui/custom-textarea";

// import { updateProfile } from "@/app/actions";
import { updateProfile } from "@/app/actions/update-profile";
import { internalErrorToast, toastError } from "@/lib/utils";
import type { updateProfileActionResponse } from "@/types";
import { UsersRecord } from "@/xata";

const initialState: updateProfileActionResponse = {
  type: "",
  message: "",
};

export default function ProfileForm({
  userInfo,
}: {
  userInfo: JSONData<UsersRecord>;
}) {
  const [playSuccess] = useSound("sounds/success.wav");
  const [playCaution] = useSound("sounds/caution.wav");

  const { fullname, website, bio, birthday } = userInfo;

  console.log({ fullname: typeof fullname });

  const [formState, formAction, isPending] = useActionState(updateProfile, {
    type: "",
    message: "",
  });

  console.log({ formState });

  useEffect(() => {
    // switch (formState.type) {
    //   case "success":
    //     playSuccess();
    //     toast.success(formState?.message);
    //     break;

    //   case "user-error":
    //     playCaution();
    //     toastError(formState?.message);
    //     break;

    //   case "internal-error":
    //     playCaution();
    //     internalErrorToast(formState?.message);
    //     break;
    //   default:
    //     null;
    // }
    if (formState.type === "success") {
      playSuccess();
      toast.success(formState?.message);
      formState.type = "";
    }
  }, [formState]);

  return (
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
          defaultValue={
            formState?.inputs?.fullname || (fullname as string) || ""
          }
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
          defaultValue={formState?.inputs?.website || (website as string) || ""}
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
          defaultValue={
            formState?.inputs?.birthday || (birthday as string) || ""
          }
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
