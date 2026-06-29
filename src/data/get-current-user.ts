export async function getCurrentUser(did: string) {
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`,
  );

  const json = await res.json();
  return {
    did: json.did,
    avatar: json.avatar,
    handle: json.handle,
    displayName: json.displayName,
  };
}
