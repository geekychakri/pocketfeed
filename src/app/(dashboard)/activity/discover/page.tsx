import DiscoverPostsList from "./components/discover-posts-list";

export default async function Page() {
  return (
    <div className="flex flex-col pt-5 pb-20">
      <DiscoverPostsList />
    </div>
  );
}
