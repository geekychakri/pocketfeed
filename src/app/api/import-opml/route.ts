import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { inngest } from "@/inngest/client";
import { getSessionAgent } from "@/lib/auth/session";
import { checkOPMLFileFormat } from "@/lib/zod/schemas/check-opml-file-format";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function POST(request: Request) {
  // const userId = (await auth()).userId as string;
  const agent = await getSessionAgent();
  const formData = await request.formData();
  const file = formData.get("opmlFile") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const data = checkOPMLFileFormat.safeParse(file);

  if (!data.success) {
    return NextResponse.json(
      { error: data.error.flatten().formErrors[0] },
      { status: 400 },
    );
  }

  // const checkOPMLFile = await xata.db["opml-files"]
  //   .filter({
  //     userId,
  //     filename: file.name,
  //   })
  //   .getFirst();

  // if (checkOPMLFile) {
  //   return NextResponse.json(
  //     {
  //       error: "You have already imported this opml file. Please check once.",
  //     },
  //     { status: 409 },
  //   );
  // }

  try {
    // const user = await currentUser();

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileData = buffer.toString("utf8");
    // Send your event payload to Inngest
    const { ids } = await inngest.send({
      name: "import/opml",
      data: {
        // fileName: file.name,
        agent,
        fileData,

        // username: user?.username,
        // userId,
      },
    });

    console.log({ ids });

    return NextResponse.json({ id: ids[0] });
  } catch (err) {
    return NextResponse.json(
      {
        id: null,
        error: "Something went wrong, but don't fret — it's not your fault.",
      },
      { status: 500 },
    );
  }
}
