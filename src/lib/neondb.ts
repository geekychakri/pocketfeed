import {
  fetchWithToken,
  NeonPostgrestClient,
} from "@neondatabase/postgrest-js";

export async function createNeonClient(getToken: () => Promise<string>) {
  return new NeonPostgrestClient({
    dataApiUrl: process.env.NEON_DATA_API_URL!,
    options: {
      global: {
        fetch: fetchWithToken(getToken),
      },
    },
  });
}
