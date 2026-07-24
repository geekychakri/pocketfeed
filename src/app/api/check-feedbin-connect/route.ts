import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    const currentUserDid = session.user?.did as string;

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to access this route.",
        },
        { status: 401 },
      );
    }

    const [feedbinAccount] = await db
      .select({ email: schema.feedbinAccounts.email })
      .from(schema.feedbinAccounts)
      .where(eq(schema.feedbinAccounts.userDid, currentUserDid))
      .limit(1);

    const hasFeedbinAccount = !!feedbinAccount;

    return Response.json({
      hasFeedbinAccount,
      feedbinEmail: feedbinAccount?.email ?? "",
    });
  } catch (err) {
    console.log(err);
    return Response.json({ msg: "Something went wrong!" }, { status: 500 });
  }
}
