import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { Link2Icon } from "@radix-ui/react-icons";
import { decode } from "html-entities";

import EmptyFeedSVG from "@/components/svg/empty-feed";

import { getXataClient } from "@/xata";

import PodcastPlayButton from "../../(feed)/feed/[...feedId]/components/PodcastPlayButton";
import YouTubeModal from "../../(feed)/feed/[...feedId]/components/YouTubeModal";
import YouTubePlayButton from "../../(feed)/feed/[...feedId]/components/YouTubePlayButton";
import DiscoverPostsList from "./components/discover-posts-list";

const xata = getXataClient();
export default async function Page() {
  const page = await xata.db.posts.sort("xata.createdAt", "desc").getPaginated({
    pagination: { size: 3 },
  });
  console.log({ page });

  const user = await currentUser();

  const hasNextPage = page.hasNextPage();
  const pageInfo = {
    hasNextPage,
    cursor: page.meta.page.cursor, // Contains cursor information
  };

  if (page.records.length >= 1) {
    return (
      <div className="flex flex-col">
        <DiscoverPostsList
          posts={page.records.toSerializable()}
          initialPageInfo={pageInfo}
          username={user?.username as string}
        />
        <YouTubeModal />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <EmptyFeedSVG className="w-[320px]" />
        <p>Looks quiet! Follow others to see their latest posts here.</p>
      </div>
    );
  }
}
