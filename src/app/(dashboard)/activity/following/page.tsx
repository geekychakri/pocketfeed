import FollowingPostsList from "./components/following-posts-list";

export default async function Page() {
  return (
    <div className="flex flex-col pt-5 pb-20">
      <FollowingPostsList />
    </div>
  );
}
