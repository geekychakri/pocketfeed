export default async function Test() {
  const findPodcast = async () => {
    const res = await fetch("https://jser.dev/rss.xml");
    const etag = res.headers.get("last-modified");
    console.log({ etag });
  };

  await findPodcast();

  return <div>Test</div>;
}
