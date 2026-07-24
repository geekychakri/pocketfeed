"use server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { encryptPassword } from "@/lib/crypto";
import getSession from "@/lib/iron-session/get-iron-session";
import { validateFeedbinEmailSchema } from "@/lib/zod/schemas/validate-feedbin-email";

type ActionStateType = {
  type: string;
  message: string;
  feedbinEmail: string;
  errors?: {
    feedbinEmail?: string[];
    feedbinPassword?: string[];
  };
  formData?: FormData;
};

const initialState = {
  type: "",
  message: "",
  feedbinEmail: "",
};

export async function saveFeedbinCreds(
  prevData: any,
  formData: FormData | null,
): Promise<ActionStateType> {
  if (formData === null) {
    return initialState;
  }
  try {
    const feedbinEmail = formData.get("feedbin-email") as string;
    const feedbinPassword = formData.get("feedbin-password") as string;

    const validate = validateFeedbinEmailSchema.safeParse({
      feedbinEmail,
      feedbinPassword,
    });

    if (!validate.success) {
      console.log(validate.error.flatten().fieldErrors);
      return {
        type: "error",
        message: "Please fix the errors in the form.",
        feedbinEmail: "",
        errors: validate.error.flatten().fieldErrors,
        formData,
      };
    }

    const session = await getSession();

    if (!session.user?.did) {
      return {
        type: "auth-error",
        message: "Authentication required.",
        feedbinEmail: "",
        formData,
      };
    }

    const auth = Buffer.from(`${feedbinEmail}:${feedbinPassword}`).toString(
      "base64",
    );

    const res = await fetch("https://api.feedbin.com/v2/authentication.json", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (res.status === 401) {
      return {
        type: "error",
        message: "Invalid Feedbin email or password.",
        feedbinEmail: "",
        formData,
      };
    }

    if (!res.ok) {
      return {
        type: "error",
        message: "Unable to connect to Feedbin. Please try again later.",
        feedbinEmail: "",
        formData,
      };
    }

    if (!res.ok) {
      throw new Error("Failed to fetch subscriptions");
    }

    const encryptedPassword = encryptPassword(feedbinPassword);

    await db.insert(schema.feedbinAccounts).values({
      userDid: session.user.did,
      email: feedbinEmail,
      encryptedPassword,
    });

    return { type: "success", message: "success", feedbinEmail };
  } catch (err) {
    console.log(err);
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      feedbinEmail: "",
      formData,
    };
  }
}
