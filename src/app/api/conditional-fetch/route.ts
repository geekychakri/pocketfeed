export async function GET() {
  try {
    const res = await fetch("https://blog.bitsrc.io/feed", {});

    console.log({ res });

    if (!res.ok) {
      return Response.json("errrr");
    }

    return Response.json({ status: res.status });
  } catch (err) {
    console.log({ err: err?.cause?.message });
  }
}
