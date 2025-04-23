const urlMetadata = require("url-metadata");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const newItemLink = searchParams.get("newItemLink");

  console.log({ newItemLink });

  const metadata = await urlMetadata(newItemLink);
  //   console.log(metadata);
  return Response.json(metadata);
}
