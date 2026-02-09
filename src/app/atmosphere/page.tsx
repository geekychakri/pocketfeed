import { getSession, getSessionAgent } from "@/lib/auth/session";

import { addRecord } from "../actions/crud-record-atproto";

export default async function Page() {
  const session = await getSession();
  const agent = await getSessionAgent();
  console.log({ session });

  console.log({ assertDid: agent?.assertDid });

  // const profileResponse = await agent?.com.atproto.repo
  //   .getRecord({
  //     repo: agent?.assertDid,
  //     collection: "app.bsky.actor.profile",
  //     rkey: "self",
  //   })
  //   .catch(() => undefined);

  // console.log({ profileResponse: profileResponse?.data });

  return (
    <div>
      <h1>Atmosphere</h1>
      {session ? session?.did : null}
      {JSON.stringify(session)}

      <form action={addRecord}>
        <button>Add post</button>
      </form>
    </div>
  );
}
