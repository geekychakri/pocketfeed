import { sql } from "drizzle-orm";

import { db } from "@/db/db";

export async function GET(request: Request) {
  try {
    const pokemon = await db.execute(sql`SELECT * FROM pokemon`);

    return Response.json({ pokemon });
  } catch (err) {
    return Response.json({ err });
  }
}
