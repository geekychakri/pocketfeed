import {
  buildAtprotoLoopbackClientMetadata,
  JoseKey,
  Keyset,
  NodeOAuthClient,
} from "@atproto/oauth-client-node";
import type {
  NodeSavedSession,
  NodeSavedState,
  OAuthClientMetadataInput,
} from "@atproto/oauth-client-node";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";

// export const SCOPE = "atproto account:email repo:com.example.record";
export const SCOPE = "atproto transition:generic";

let client: NodeOAuthClient | null = null;

const PUBLIC_URL = process.env.PUBLIC_URL; //TODO: set public url in prod
const PRIVATE_KEY = process.env.PRIVATE_KEY;

function getClientMetadata(): OAuthClientMetadataInput {
  if (PUBLIC_URL) {
    return {
      client_id: `${PUBLIC_URL}/oauth-client-metadata.json`,
      client_name: "Pocket Feed",
      client_uri: PUBLIC_URL,
      redirect_uris: [`${PUBLIC_URL}/oauth/callback`],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      scope: SCOPE,
      token_endpoint_auth_method: "private_key_jwt" as const,
      token_endpoint_auth_signing_alg: "ES256" as const, // must match the alg in scripts/gen-key.ts
      jwks_uri: `${PUBLIC_URL}/.well-known/jwks.json`,
      dpop_bound_access_tokens: true,
    };
  } else {
    return buildAtprotoLoopbackClientMetadata({
      scope: SCOPE,
      redirect_uris: ["http://127.0.0.1:3000/oauth/callback"],
    });
  }
}

async function getKeyset(): Promise<Keyset | undefined> {
  if (PUBLIC_URL && PRIVATE_KEY) {
    return new Keyset([await JoseKey.fromJWK(JSON.parse(PRIVATE_KEY))]);
  } else {
    return undefined;
  }
}

export async function getOAuthClient(): Promise<NodeOAuthClient> {
  if (client) return client;

  client = new NodeOAuthClient({
    clientMetadata: getClientMetadata(),
    keyset: await getKeyset(),

    stateStore: {
      async get(key: string) {
        // const db = getDb();
        const res = await db
          .select({ value: schema.authState.value })
          .from(schema.authState)
          .where(eq(schema.authState.key, key))
          .limit(1);
        const row = res[0];
        if (!row) throw new Error("Not found!");

        // const row = await db
        //   .selectFrom("auth_state")
        //   .select("value")
        //   .where("key", "=", key)
        //   .executeTakeFirst();
        return row ? JSON.parse(row.value) : undefined;
      },
      async set(key: string, value: NodeSavedState) {
        // const db = getDb();
        const valueJson = JSON.stringify(value);
        await db
          .insert(schema.authState)
          .values({ key, value: valueJson })
          .onConflictDoUpdate({
            target: schema.authState.key,
            set: { value: valueJson },
          });
        // await db
        //   .insertInto("auth_state")
        //   .values({ key, value: valueJson })
        //   .onConflict((oc) =>
        //     oc.column("key").doUpdateSet({ value: valueJson }),
        //   )
        //   .execute();
      },
      async del(key: string) {
        // const db = getDb();
        await db.delete(schema.authState).where(eq(schema.authState.key, key));
        // await db.deleteFrom("auth_state").where("key", "=", key).execute();
      },
    },

    sessionStore: {
      async get(key: string) {
        // const db = getDb();
        // const row = await db
        //   .selectFrom("auth_session")
        //   .select("value")
        //   .where("key", "=", key)
        //   .executeTakeFirst();
        const res = await db
          .select({ value: schema.authSession.value })
          .from(schema.authSession)
          .where(eq(schema.authSession.key, key))
          .limit(1);
        const row = res[0];
        if (!row) throw new Error("Not found!");
        return row ? JSON.parse(row.value) : undefined;
      },
      async set(key: string, value: NodeSavedSession) {
        // const db = getDb();
        const valueJson = JSON.stringify(value);
        await db
          .insert(schema.authSession)
          .values({ key, value: valueJson })
          .onConflictDoUpdate({
            target: schema.authSession.key,
            set: { value: valueJson },
          });
        // await db
        //   .insertInto("auth_session")
        //   .values({ key, value: valueJson })
        //   .onConflict((oc) =>
        //     oc.column("key").doUpdateSet({ value: valueJson }),
        //   )
        //   .execute();
      },
      async del(key: string) {
        // const db = getDb();
        // await db.deleteFrom("auth_session").where("key", "=", key).execute();
        await db
          .delete(schema.authSession)
          .where(eq(schema.authSession.key, key));
      },
    },
  });

  return client;
}
