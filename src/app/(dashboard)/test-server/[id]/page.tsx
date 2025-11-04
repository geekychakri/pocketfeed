export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return (
    <div>
      My Post: {id}
      <input type="text" className="border" />
    </div>
  );
}
