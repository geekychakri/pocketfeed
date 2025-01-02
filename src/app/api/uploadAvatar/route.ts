import { getXataClient, UsersRecord } from "@/xata";

const xata = getXataClient();

import { auth, currentUser } from "@clerk/nextjs/server";

import { cloudinary } from "@/lib/cloudinary";

import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

type ResType = {
  success: boolean;
  error?: string;
  result?: UploadApiResponse | undefined;
};

export async function POST(request: Request) {
  const username = await currentUser();
  const formData = await request.formData();
  const file = formData.get("avatar") as File;

  console.log(file);

  const fileBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(fileBuffer);

  const { userId }: { userId: string | null } = auth();

  console.log({ userId });
  const user = (await xata.db.users
    .filter({ userId: userId })
    .getFirst()) as UsersRecord;

  console.log({ user });

  const userAvatarExists = await cloudinary.api.resource(
    user.avatarPublicId as string,
  );

  console.log({ userAvatarExists });

  if (userAvatarExists.public_id) {
    console.log("USER AVATAR EXISTS");
    const res: ResType = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: user.avatarPublicId as string,
            invalidate: true,
            // folder: "avatars",
            overwrite: true,
          },
          function (error, result) {
            if (error) {
              reject({ success: false, error });
              return;
            } else {
              resolve({ success: true, result });
            }
          },
        )
        .end(buffer);
    });

    if (res.success && res.result) {
      // console.log({ imgResult: res.result });
      const saveAvatarUrlToDB = await xata.db.users.update(user.id, {
        avatarUrl: res.result.secure_url,
      });
      console.log({ saveAvatarUrlToDB });

      return Response.json({
        msg: "success",
        imgUrl: res.result.secure_url,
      });
    } else {
      return Response.json({ msg: "Something went wrong!", imgUrl: "" });
    }
  }

  const res: ResType = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "avatars",
          public_id: user.username as string,
          overwrite: true,
        },
        function (error, result) {
          if (error) {
            reject({ success: false, error });
            return;
          } else {
            resolve({ success: true, result });
          }
        },
      )
      .end(buffer);
  });

  if (res.success && res.result) {
    console.log({ imgResult: res.result });
    const saveAvatarUrlToDB = await xata.db.users.update(user.id, {
      avatarUrl: res.result.secure_url,
      avatarPublicId: res.result.public_id,
    });
    console.log({ saveAvatarUrlToDB });

    return Response.json({
      msg: "success",
      imgUrl: res.result.secure_url,
    });
  } else {
    return Response.json({ msg: "Something went wrong!", imgUrl: "" });
  }
}
