import { getXataClient } from "@/xata";

import { Link2Icon } from "@radix-ui/react-icons";

import Link from "next/link";

import YouTubeModal from "../../(feed)/feed/[...feedId]/components/YouTubeModal";
import YouTubePlayButton from "../../(feed)/feed/[...feedId]/components/YouTubePlayButton";
import PodcastPlayButton from "../../(feed)/feed/[...feedId]/components/PodcastPlayButton";

import { decode } from "html-entities";
import DiscoverPostsList from "./components/discover-posts-list";

const xata = getXataClient();
export default async function Page() {
  const page = await xata.db.posts.getPaginated({
    pagination: { size: 3 },
  });
  console.log({ page });

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
        />
        <YouTubeModal />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <img src="/empty-feed.svg" alt="empty-feed" className="w-[320px]" />
        <p>Looks quiet! Follow others to see their latest posts here.</p>
      </div>
    );
  }
}
