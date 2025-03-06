import { PostIcon } from "@/icons/post";

export default function Posts() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <PostIcon className="size-20" />
      <span>No posts yet!</span>
    </div>
  );
}
