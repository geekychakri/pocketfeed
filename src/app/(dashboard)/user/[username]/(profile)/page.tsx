import { PostIcon } from "@/icons/post";

export default async function Posts() {
  const p = () => new Promise((resolve) => setTimeout(resolve, 5000));
  await p();
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <PostIcon className="size-20" />
      <span>No posts yet!</span>
    </div>
  );
}
