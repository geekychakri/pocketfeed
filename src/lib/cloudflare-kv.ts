const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CLOUDFLARE_KV_NAMESPACE_ID}`;

export const hasKVItem = async () => {};

export const getKVItem = async (key: string) => {
  try {
    const res = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_KV_API_TOKEN}`,
      },
    });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`Something went wrong!`);
    }

    return res.json();
  } catch (err: any) {
    return null;
  }
};

export const setKVItem = async (key: string, value: any) => {
  try {
    const res = await fetch(
      `${baseUrl}/values/${encodeURIComponent(key)}?cache_ttl=3600`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_KV_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: value,
      },
    );
    if (!res.ok) {
      throw new Error(`Something went wrong!`);
    }
  } catch (err: any) {
    return null;
  }
};

export const deleteKVItem = async () => {};
