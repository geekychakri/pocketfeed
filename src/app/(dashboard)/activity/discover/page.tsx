import { getXataClient } from "@/xata";

import { Link2Icon } from "@radix-ui/react-icons";

import Link from "next/link";
import PodcastPlayButton from "../../(feed)/feed/[feedId]/components/PodcastPlayButton";
import YouTubePlayButton from "../../(feed)/feed/[feedId]/components/YouTubePlayButton";

import YouTubeModal from "../../(feed)/feed/[feedId]/components/YouTubeModal";

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

  return (
    <>
      <div className="flex flex-col gap-8">
        <DiscoverPostsList
          posts={page.records.toSerializable()}
          initialPageInfo={pageInfo}
        />
      </div>
      <YouTubeModal />
    </>
  );
}
