import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { Link2Icon } from "@radix-ui/react-icons";
import { and, asc, desc, eq, gt, lt, or, sql } from "drizzle-orm";
import { decode } from "html-entities";

import EmptyFeedSVG from "@/components/svg/empty-feed";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getXataClient } from "@/xata";

import PodcastPlayButton from "../../(feed)/feed/components/PodcastPlayButton";
import YouTubeModal from "../../(feed)/feed/components/YouTubeModal";
import YouTubePlayButton from "../../(feed)/feed/components/YouTubePlayButton";
import DiscoverPostsList from "./components/discover-posts-list";

// const xata = getXataClient();
export default async function Page() {
  return (
    <div className="flex flex-col pb-20">
      <DiscoverPostsList />
    </div>
  );
}

// const page = await xata.db.posts.sort("xata.createdAt", "desc").getPaginated({
//   pagination: { size: 3 },
// });
// console.log({ page });

// const user = await currentUser();

// const hasNextPage = page.hasNextPage();
// const pageInfo = {
//   hasNextPage,
//   cursor: page.meta.page.cursor, // Contains cursor information
// };
//

// const data = await db.select().from(schema.posts);

// console.log({ data });

// const cursor = "";
// const pageSize = 2 + 1;

// const data = await db
//   .select()
//   .from(schema.posts)
//   .where(
//     cursor
//       ? or(
//           lt(schema.posts.createdAt, cursor.createdAt),
//           and(
//             eq(schema.posts.createdAt, cursor.createdAt),
//             lt(schema.posts.id, cursor.id),
//           ),
//         )
//       : undefined,
//   )
//   .limit(pageSize) // the number of rows to return
//   .orderBy(desc(schema.posts.createdAt)); // ordering
// console.log({ data });

// const result = await db.execute(
//   sql`SELECT setting FROM pg_settings WHERE name = 'server_version'`,
// );

// console.log({ result: result.rows[0].setting });

// <div className="flex flex-col">
//   hello
//   <DiscoverPostsList
//   // posts={data}
//   // initialPageInfo={pageInfo}
//   // username={user?.username as string}
//   />
//   <YouTubeModal />
// </div>;

// return "Posts";

// if (data.length >= 1) {
//   return (
//     <div className="flex flex-col">
//       <DiscoverPostsList
//         // posts={data}
//         // initialPageInfo={pageInfo}
//         // username={user?.username as string}
//       />
//       <YouTubeModal />
//     </div>
//   );
// } else {
//   return (
//     <div className="flex flex-col items-center gap-4 py-6">
//       <EmptyFeedSVG className="w-[320px]" />
//       <p>Looks quiet! Follow others to see their latest posts here.</p>
//     </div>
//   );
// }
