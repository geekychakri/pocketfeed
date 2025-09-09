"use server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function createUser(email: string, username: string) {
  try {
    // Mutate data
    const record = await xata.db.users.create({
      email,
      username,
    });
    return { message: "success" };
  } catch (e) {
    throw new Error("Failed to create user");
  }
}
