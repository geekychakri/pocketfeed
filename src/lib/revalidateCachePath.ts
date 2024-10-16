"use server";
import { revalidatePath } from "next/cache";

export async function revalidateCachePath(
  path: string,
  type: "page" | "layout",
) {
  revalidatePath(path, type);
}
