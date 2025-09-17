import { BookmarksStoreProvider } from "@/context/bookmarks-provider";
import { getXataClient } from "@/xata";
import { auth, currentUser } from "@clerk/nextjs/server";
import BookmarkList from "./components/bookmark-list";
import RouteBack from "@/components/route-back";
import PodcastLoader from "@/components/podcast-loader";

const xata = getXataClient();

export default async function Bookmarks() {
  const userId = (await auth()).userId || "";
  // const page = await xata.db.bookmarks
  //   .filter({
  //     userId: userId,
  //   })
  //   .sort("xata.createdAt", "desc")
  //   .getPaginated({
  //     pagination: { size: 2 },
  //   });
  const bookmarks = await xata.db.bookmarks.filter({ userId: userId }).getAll();

  // console.log(page);
  // const pageInfo = {
  //   hasNextPage: page.hasNextPage(),
  //   cursor: page.meta.page.cursor, // Contains cursor information
  // };
  return (
    <div className="mx-auto w-full max-w-[750px] py-20">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-lg font-medium">Bookmarks</h1>
      </div>
      {/* <BookmarksStoreProvider initialData={page.records.toSerializable()}> */}
      <BookmarkList
        // initialBookmarks={page.records.toSerializable()}
        // initialPageInfo={pageInfo}
        bookmarks={bookmarks.toSerializable()}
      />
      {/* </BookmarksStoreProvider> */}
    </div>
  );
}
