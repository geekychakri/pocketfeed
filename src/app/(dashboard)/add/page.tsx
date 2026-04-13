import RouteBack from "@/components/route-back";

import AddFeed from "./components/add-feed";

export default async function Page() {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-7 py-18">
      <div className="">
        <RouteBack className="absolute -left-9" />
        <h1 className="flex items-center gap-3 text-xl font-medium">
          <span>Add feed</span>
        </h1>
      </div>
      <AddFeed />
    </div>
  );
}
