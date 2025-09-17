// not included recheck once

"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();
export async function addNewFolder(prevState: any, formData: FormData) {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      throw new Error("You must be signed in to add a new folder!");
    }
    const user = await currentUser();
    if (!userId) {
      throw new Error("You must be signed in to add a feed!");
    }
    const folder = formData.get("folder") as string;
    const folderExists = await xata.db.folders
      .filter({ userId, folder })
      .getFirst();

    if (!folderExists) {
      const newFolder = await xata.db.folders.create({
        userId,
        folder,
        username: user?.username as string,
      });
      console.log({ newFolder });

      // if (!res.ok) {
      //   return { message: 'Please enter a valid email' }
      // }

      // redirect(`/folder/${folder}`);

      return { message: "success", id: newFolder.id };
    } else {
      return { message: "Folder already exists!", id: "" };
    }
  } catch (err) {}
}
