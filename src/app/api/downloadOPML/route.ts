// import { NextResponse } from "next/server";

// import { auth, currentUser } from "@clerk/nextjs/server";
// import xml2js from "xml2js";

// import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
// import { getXataClient } from "@/xata";

// const xata = getXataClient();

// export async function GET(request: Request) {
//   try {
//     const user = await currentUser();
//     const userId = (await auth()).userId as string;

//     if (!userId) {
//       return Response.json(
//         {
//           message: "You must be signed in to download your subscriptions list.",
//         },
//         { status: 401 },
//       );
//     }
//     // console.log({ user });
//     const feeds = await xata.db.feeds
//       .filter({ username: user?.username })
//       .select(["*", "folderName.folder"])
//       .getAll(); //TODO: getAll or getMany or filter by userId
//     console.dir(feeds);

//     const feedsByFolder = {} as {};
//     // feeds.forEach((feed) => {
//     //   if (!feedsByFolder[feed.folderName.folder]) {
//     //     feedsByFolder[feed.folderName.folder] = [];
//     //   }
//     //   feedsByFolder[feed.folderName.folder].push(feed);
//     // });

//     for (let feed of feeds) {
//       // if (!feedsByFolder[feed.folderName.folder]) {
//       //   feedsByFolder[feed.folderName.folder] = [];
//       // }
//       // feedsByFolder[feed.folderName.folder].push(feed);
//       const { folderName } = feed;
//       feedsByFolder[folderName.folder] = feedsByFolder[folderName.folder] ?? [];
//       feedsByFolder[folderName.folder].push(feed);
//     }

//     console.log(feedsByFolder);

//     function createOPML(feeds: any) {
//       const opmlObject = {
//         opml: {
//           $: { version: "1.0" },
//           head: {
//             title: "Your Pocket Feed Subscriptions",
//             dateCreated: new Date().toString(),
//           },
//           body: {
//             // outline: {
//             //   $: { text: "Feeds", title: "Feeds" },
//             //   outline: feeds.map((feed: any) => ({
//             //     $: {
//             //       type: "rss",
//             //       text: feed.title,
//             //       title: feed.title,
//             //       xmlUrl: feed.xmlUrl,
//             //       htmlUrl: feed.htmlUrl,
//             //     },
//             //   })),
//             // },
//             outline: Object.keys(feedsByFolder).map((folderName: string) => ({
//               $: { title: folderName, text: folderName },
//               outline: feedsByFolder[folderName].map((feed: any) => ({
//                 $: {
//                   type: "rss",
//                   text: feed.title,
//                   title: feed.title,
//                   xmlUrl: feed.rssURL,
//                   htmlUrl: feed.siteURL,
//                 },
//               })),
//             })),
//           },
//         },
//       };

//       // Create XML from the JavaScript object using xml2js.Builder
//       const builder = new xml2js.Builder({ headless: true });
//       return builder.buildObject(opmlObject);
//     }

//     const opmlData = createOPML(feeds);

//     return Response.json({ opml: opmlData }, { status: 200 });
//   } catch (err) {
//     return Response.json("", { status: 500 });
//   }
// }
