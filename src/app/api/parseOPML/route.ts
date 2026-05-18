// import path from "path";
// import { revalidatePath } from "next/cache";

// import { auth, currentUser } from "@clerk/nextjs/server";
// import { nanoid } from "nanoid";
// import xml2js from "xml2js";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("opmlFile") as File;
//     const user = await currentUser();
//     const userId = (await auth()).userId as string;

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const fileData = buffer.toString("utf8");

//     function extractFeeds(outline: any) {
//       let feeds = [];

//       if (outline.outline) {
//         for (let subOutline of outline.outline) {
//           // console.log({ outline: outline.$ });
//           if (subOutline.$.type === "rss") {
//             const attributes = subOutline.$;
//             const feedtype =
//               path.extname(attributes.xmlUrl) === ".json" ? "json" : "text";
//             feeds.push({
//               name: attributes.title,
//               url: attributes.htmlUrl,
//               feed: attributes.xmlUrl,
//               folder: outline.$.title,
//               // feedType: feedtype,
//             });
//           }
//         }
//       } else {
//         feeds.push({
//           name: outline.$.title,
//           url: outline.$.htmlUrl,
//           feed: outline.$.xmlUrl,

//           // feedType: feedtype,
//         });
//       }

//       // if (outline.outline) {
//       //   for (let subOutline of outline.outline) {
//       //     feeds = feeds.concat(extractFeeds(subOutline));
//       //   }
//       // }
//       return feeds;
//     }

//     //   xml2js.parseString(fileData, function (err, result) {
//     //     console.log(result.opml.body[0].outline[0].outline);

//     //     data = result.opml.body[0].outline[0].outline
//     //       .map((item) => item["$"])
//     //       .map((item) => item.text);
//     //     console.log(data);
//     //   });

//     // Parse the OPML file
//     let result = await xml2js.parseStringPromise(fileData);

//     const feeds = [];
//     for (let outline of result.opml.body[0].outline) {
//       // console.log(outline);
//       feeds.push(...extractFeeds(outline));
//     }

//     // console.log({ feeds });

//     const uniqueFolders = [...new Set(feeds.map((item) => item.folder))];

//     const folders = uniqueFolders.map((folderName) => ({
//       userId,
//       folder: folderName,
//       username: user?.username as string,
//     }));

//     const newFolders = await xata.db.folders.create(folders);

//     console.log({ newFolders });

//     // const folderIds = feeds.map(feed )
//     const finalFeeds = feeds.map((feed) => {
//       const matchingFolder = newFolders.find(
//         (item) => item.folder === feed.folder,
//       );
//       if (matchingFolder) {
//         return {
//           feedId: nanoid(),
//           siteURL: feed.url,
//           username: user?.username,
//           rssURL: feed.feed,
//           userId,
//           title: feed.name,
//           // folderId: matchingFolder.id,
//           folderName: {
//             id: matchingFolder.id,
//             userId,
//             folder: matchingFolder.folder,
//             username: user?.username as string,
//           },
//         };
//       }
//     });

//     console.log({ finalFeeds });

//     const records = await xata.db.feeds.create(finalFeeds as []);

//     return Response.json({ redirectFolderName: uniqueFolders[0] });
//   } catch (err) {
//     return Response.json("", { status: 500 });
//   }

//   // {feedId, siteURL, username, rssURL, favicon, userId, title}

//   //   xml2js.parseString(fileData, (err, result) => {
//   //     if (err) {
//   //       console.error(err);
//   //       return;
//   //     }

//   //     const feeds = [];
//   //     for (let outline of result.opml.body[0].outline) {
//   //       console.log(outline);
//   //       feeds.push(...extractFeeds(outline));
//   //     }
//   //   });
// }
