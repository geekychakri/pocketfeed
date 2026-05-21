import type { AppBskyActorDefs } from "@atproto/api";

// User type
export type User = {
  did: string;
  handle: string;
  displayName: string;
  avatar: string | null;
};

// Create a user
export function createUserSession(
  data: AppBskyActorDefs.ProfileViewDetailed,
): User {
  return {
    did: data.did,
    handle: data.handle,
    displayName: data.displayName || data.handle,
    avatar: data.avatar || null,
  };
}
