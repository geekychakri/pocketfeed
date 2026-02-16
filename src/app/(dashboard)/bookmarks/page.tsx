import { Suspense } from "react";

import { auth, currentUser } from "@clerk/nextjs/server";

import PodcastLoader from "@/components/podcast-loader";
import RouteBack from "@/components/route-back";

import { BookmarksStoreProvider } from "@/context/bookmarks-provider";
import { getBookmarks } from "@/db/queries";

// import { getXataClient } from "@/xata";

import BookmarkList from "./components/bookmark-list";

// const xata = getXataClient();

export default async function BookmarksPage() {
  // const userId = (await auth()).userId || "";
  // const page = await xata.db.bookmarks
  //   .filter({
  //     userId: userId,
  //   })
  //   .sort("xata.createdAt", "desc")
  //   .getPaginated({
  //     pagination: { size: 2 },
  //   });
  // const bookmarks = await xata.db.bookmarks.filter({ userId: userId }).getAll();

  // console.log(page);
  // const pageInfo = {
  //   hasNextPage: page.hasNextPage(),
  //   cursor: page.meta.page.cursor, // Contains cursor information
  // };

  const bookmarksPromise = getBookmarks();

  // console.log({ bookmarks });

  // return <div>Bookmarks</div>;
  return (
    <div className="mx-auto w-full max-w-[750px] py-20 border-x min-h-screen">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-lg font-medium px-4">Later</h1>
      </div>
      {/* <BookmarksStoreProvider initialData={page.records.toSerializable()}> */}
      <Suspense fallback="Loading...">
        <BookmarkList
          // initialBookmarks={page.records.toSerializable()}
          // initialPageInfo={pageInfo}
          bookmarksPromise={bookmarksPromise}
        />
      </Suspense>
      {/* </BookmarksStoreProvider> */}
    </div>
  );
}
