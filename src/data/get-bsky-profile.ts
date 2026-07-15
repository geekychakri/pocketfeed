export async function getBskyProfile(username: string) {
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${username}`,
  );

  const json = await res.json();
  return {
    did: json.did,
    avatar: json.avatar,
    handle: json.handle,
    displayName: json.displayName,
  };
}
