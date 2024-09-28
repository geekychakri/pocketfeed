import { getXataClient, UsersRecord } from "@/xata";

const xata = getXataClient();

import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("avatar") as File;

  console.log(file);

  const { userId }: { userId: string | null } = auth();

  console.log({ userId });
  const user = (await xata.db.users
    .filter({ clerkUserId: userId })
    .getFirst()) as UsersRecord;

  const avatarData = await xata.files.upload(
    { table: "users", column: "avatar", record: user.id },
    file,
  );

  console.log({ avatarData });

  //   return new Promise((resolve) => resolve(Response.json("hello")));
  return Response.json({ avatarUrl: avatarData.url });
}
