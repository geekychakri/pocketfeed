import { getXataClient } from "@/xata";

import { Link2Icon } from "@radix-ui/react-icons";

import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import FollowingPostsList from "./components/following-posts-list";

const xata = getXataClient();
export default async function Page() {
  const user = await currentUser();

  const followingNames = await xata.db.follows
    .filter({ followerName: user?.username as string })
    .select(["followeeName"])
    .getAll(); //TODO:
  console.log({ followingNames });

  const followedUserNames = followingNames.map((record) => record.followeeName);

  console.log({ followedUserNames });

  const page = await xata.db.posts
    .filter({ username: { $any: followedUserNames } })
    .getPaginated({
      pagination: {
        size: 3,
      },
    }); //TODO: sort the results by desc  order
  const hasNextPage = page.hasNextPage();
  const pageInfo = {
    hasNextPage,
    cursor: page.meta.page.cursor, // Contains cursor information
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-8">
        {/* {posts.map((post, index) => {
          return (
            <div
              key={post.id}
              className="flex flex-col gap-2 rounded-lg border bg-white shadow-sm"
            >
              <div className="flex flex-col gap-2 p-4">
                <Link href={`/user/${post.username}`} className="flex gap-1">
                  <span className="font-medium">Minicodecamp </span>
                  <span className="text-gray-400">@{post.username}</span>
                  <span>·</span>
                  <span className="text-gray-400">2h</span>
                </Link>
                <p>{post.body}</p>
              </div>
              <Link
                href={`/read/${encodeURIComponent(post.feedItemUrl)}`}
                prefetch={false}
                rel="noopener noreferrer"
                className="m-[3px] flex flex-col gap-4 rounded-b-lg rounded-t-2xl border bg-[#fbfbfb] p-3 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h2 className="text-primary font-medium">
                      {post.feedItemTitle}
                    </h2>
                    <Link2Icon className="size-5" />
                  </div>
                  <p className="text-gray-500">{post.feedItemAuthor}</p>
                </div>
                <p className="line-clamp-2">{post.feedItemDescription}</p>
              </Link>
            </div>
          );
        })} */}
        <FollowingPostsList
          posts={page.records.toSerializable()}
          initialPageInfo={pageInfo}
        />
      </div>
    </div>
  );
}
