export async function GET(request: Request) {
  try {
    const ytChannelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCWIzrKzN4KY6BPU8hsk880Q&key=${process.env.YOUTUBE_API_KEY}`,
      {
        referrer:
          process.env.NODE_ENV === "production"
            ? "https://pocket-feed.vercel.app" //TODO:
            : "http://localhost:3000",
      },
    );

    const ytChannelData = await ytChannelResponse.json();

    const ytChannelAvatarUrl =
      ytChannelData.items[0].snippet.thumbnails.default.url;
    console.log(ytChannelAvatarUrl);
    return Response.json(ytChannelAvatarUrl);
  } catch (err) {
    return null;
  }
}
