"use client";

import { useOPMLFeed } from "@/store/opmlfeed";

import RouteBack from "@/components/RouteBack/RouteBack";

export default function ImportFeeds() {
  //   const feeds = useOPMLFeed((state) => state.feeds);
  const { feeds } = useOPMLFeed();

  console.log({ feeds });

  console.log(useOPMLFeed());
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const body = Object.fromEntries(formData);
    console.log(body);
  };
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 py-20">
      <div className="flex items-center gap-4">
        <RouteBack />
        <h1 className="text-xl font-semibold">Import Feeds</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {feeds.map((feed, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-md border p-6">
            <div className="flex flex-col gap-1">
              <p>{feed?.name}</p>
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500">
                {feed.url}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="folder" className="text-sm text-gray-500">
                Select folder
              </label>
              <select
                name={feed.name}
                id="folder"
                className="rounded-md p-2 text-sm"
              >
                <option value="Home">Home</option>
                <option value="Tech">Tech</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
          </div>
        ))}
        <button
          className="bg-primary rounded-md px-4 py-2 font-medium text-white disabled:opacity-50"
          disabled={feeds.length === 0}
        >
          Add
        </button>
      </form>
    </div>
  );
}
