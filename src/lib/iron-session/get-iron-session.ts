"use server";

import { cookies } from "next/headers";

import { getIronSession, type IronSession } from "iron-session";

import type { User } from "./create-user-session";

type Session = {
  user: User | null;
};

const getSession = async (): Promise<IronSession<Session>> => {
  return await getIronSession<Session>(await cookies(), {
    cookieName: "pf-user-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.IRON_SESSION_PASSWORD!,
  });
};

export default getSession;
