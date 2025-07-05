export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Send your event payload to Inngest
    const { id } = await params;
    const response = await fetch(
      `http://127.0.0.1:8288/v1/events/${id}/runs`,
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      //   },
      // }, // not required in dev environment
    );
    const json = await response.json();
    console.log({ inngestData: json.data[0] });
    console.log({ status: json?.data[0]?.status });
    return Response.json({
      status: json?.data[0]?.status,
      message: json?.data[0]?.output.message,
    });
  } catch (err) {
    return Response.json({
      status: null,
      message: "error",
    });
  }
}
