"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { getXataClient } from "@/xata";

import { updateProfileSchema } from "@/lib/zod/schemas/update-profile";
import type { updateProfileActionResponse } from "@/types";
import { cleanUrl } from "@/lib/utils";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const xata = getXataClient();

export async function updateProfile(
  prevState: updateProfileActionResponse | null,
  formData: FormData,
): Promise<updateProfileActionResponse> {
  try {
    const rawFormData = {
      fullname: formData.get("fullname") as string,
      website: formData.get("website") as string,
      bio: formData.get("bio") as string,
      birthday: formData.get("birthday") as string,
    };
    console.log(rawFormData);
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to update your profile!",
      };
    }
    const data = updateProfileSchema.safeParse(rawFormData);

    console.log({ data });

    if (!data.success) {
      console.log(data.error.flatten().fieldErrors);
      return {
        type: "user-error",
        message: "Please fix the errors in the form.",
        errors: data.error.flatten().fieldErrors,
        inputs: rawFormData,
      };
    }
    const fullname = formData.get("fullname") as string;
    const website = cleanUrl(formData.get("website") as string);
    const bio = formData.get("bio") as string;
    const birthday = formData.get("birthday") as string;

    console.log({ fullname, website, bio });

    const user = await xata.db.users.filter({ userId: userId }).getFirst();
    const updateUser = await xata.db.users.update(user?.id as string, {
      fullname,
      website,
      bio,
      birthday,
    });
    revalidatePath("/user/[username]/(content)", "layout");
    return { type: "success", message: "Profile updated successfully!" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
