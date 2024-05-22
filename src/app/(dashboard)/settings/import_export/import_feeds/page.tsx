"use client";

import { useOPMLFeed } from "@/store/opmlfeed";

import RouteBack from "@/components/RouteBack/RouteBack";

export default function ImportFeeds() {
  //   const feeds = useOPMLFeed((state) => state.feeds);
  const { feeds } = useOPMLFeed();

  console.log(useOPMLFeed());
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const body = Object.fromEntries(formData);
    console.log(body);
  };
  return (
    <main className="flex flex-col gap-12 w-full max-w-[520px] mx-auto py-20">
      <div className="flex items-center gap-4">
        <RouteBack />
        <h1 className="text-xl font-semibold">Import Feeds</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {feeds.map((feed, i) => (
          <div key={i} className="flex flex-col gap-3 border p-6 rounded-md">
            <div className="flex flex-col gap-1">
              <p>{feed?.name}</p>
              <p className="text-gray-500 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
                {feed.url}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="folder" className="text-gray-500 text-sm">
                Select folder
              </label>
              <select
                name={feed.name}
                id="folder"
                className="p-2 rounded-md text-sm"
              >
                <option value="Home">Home</option>
                <option value="Tech">Tech</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
          </div>
        ))}
        <button
          className="font-medium bg-primary disabled:opacity-50 text-white px-4 py-2 rounded-md"
          disabled={feeds.length === 0}
        >
          Add
        </button>
      </form>
    </main>
  );
}
