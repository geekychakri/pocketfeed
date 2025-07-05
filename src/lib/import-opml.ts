import xml2js from "xml2js";

import { FoldersRecord, getXataClient } from "@/xata";

import { FetcherError, SelectedPick } from "@xata.io/client";

import { nanoid } from "nanoid";

const xata = getXataClient();

export async function ImportOPML(
  fileName: string,
  fileData: any,
  username: string,
  userId: string,
) {
  //   const user = await currentUser();
  //   const userId = (await auth()).userId as string;

  // return { message: "error" };

  try {
    console.log({ userId });
    function extractFeeds(outline: any) {
      let feeds = [];

      if (outline.outline) {
        for (let subOutline of outline.outline) {
          // console.log({ outline: outline.$ });
          if (subOutline.$.type === "rss") {
            const attributes = subOutline.$;
            //   const feedtype =
            //     path.extname(attributes.xmlUrl) === ".json" ? "json" : "text";
            feeds.push({
              name: attributes.title,
              url: attributes.htmlUrl,
              feed: attributes.xmlUrl,
              folder: outline.$.title,
              // feedType: feedtype,
            });
          }
        }
      } else {
        feeds.push({
          name: outline.$.title,
          url: outline.$.htmlUrl,
          feed: outline.$.xmlUrl,
          folder: outline.$.title,
          // feedType: feedtype,
        });
      }

      // if (outline.outline) {
      //   for (let subOutline of outline.outline) {
      //     feeds = feeds.concat(extractFeeds(subOutline));
      //   }
      // }
      return feeds;
    }

    // Parse the OPML file
    let result = await xml2js.parseStringPromise(fileData);

    const feeds = [];
    for (let outline of result.opml.body[0].outline) {
      // console.log(outline);
      feeds.push(...extractFeeds(outline));
    }

    // console.log({ feeds });

    const uniqueFolders = [...new Set(feeds.map((item) => item.folder))];

    console.log({ uniqueFolders });

    const getExistingFolders = await xata.db.folders
      .filter({
        userId,
      })
      .select(["folder"])
      .getAll();

    const getExistingFeeds = await xata.db.feeds
      .filter({
        userId,
      })
      .select(["rssURL"])
      .getAll();

    console.log({ getExistingFolders });

    const extractFolders = getExistingFolders.map((record) => record.folder);

    console.log({ extractFolders });

    const filteredFolders = [...extractFolders, ...uniqueFolders];

    // const resultArr = filteredFolders.filter(
    //   (item, index, arr) => arr.lastIndexOf(item) == arr.indexOf(item),
    // );
    const resultArr = uniqueFolders.filter(
      (o) => !extractFolders.find((o2) => o === o2),
    );

    console.log({ resultArr });

    let newFolders: Readonly<SelectedPick<FoldersRecord, ["*"]>>[] = [];
    if (resultArr.length >= 1) {
      const folders = resultArr.map((folderName) => ({
        userId,
        folder: folderName,
        username: username as string,
      }));

      console.log({ folders });

      newFolders = await xata.db.folders.create(folders);
    }

    // console.log({ filteredFolders });

    // return { message: "error" };

    //   console.log({ newFolders });

    const combineExistingAndNewFolders = [...getExistingFolders, ...newFolders];

    //   // const folderIds = feeds.map(feed )
    const finalFeeds = feeds.map((feed) => {
      const matchingFolder = combineExistingAndNewFolders.find(
        (item) => item.folder === feed.folder,
      );
      if (matchingFolder) {
        return {
          feedId: nanoid(),
          siteURL: feed.url,
          username: username,
          rssURL: feed.feed,
          userId,
          title: feed.name,
          // folderId: matchingFolder.id,

          folderName: matchingFolder.id,

          // folderName: {
          //   id: matchingFolder.id,
          //   userId,
          //   folder: matchingFolder.folder,
          //   username: username as string,
          // },
        };
      }
    });

    console.log({ finalFeeds });

    // const feedsSet = new Set();
    const combineExistingAndNewFeeds = [...getExistingFeeds, ...finalFeeds];

    const finalFreshFeeds = finalFeeds.filter(
      (o) => !getExistingFeeds.find((o2) => o?.rssURL === o2.rssURL),
    );

    // const finalFreshFeeds = combineExistingAndNewFeeds.filter(
    //   (obj, index, arr) =>
    //     arr.findIndex((item) => item?.rssURL === obj?.rssURL) ===
    //     arr.findLastIndex((item) => item?.rssURL === obj?.rssURL),
    // );

    //  const resultArr = filteredFolders.filter(
    //   (item, index, arr) => arr.lastIndexOf(item) == arr.indexOf(item),
    // );

    console.log({ finalFreshFeeds });

    // return { message: "success" };

    if (finalFreshFeeds.length >= 1) {
      // const feedRecords = await xata.db.feeds.create(finalFeeds as []);
      // const opmlRecords = await xata.db["opml-files"].create({
      //   username,
      //   filename: fileName,
      // });

      const finalRecords = finalFreshFeeds.map((record) => ({
        insert: {
          table: "feeds", // your table name
          record,
        },
      })) as [];

      console.dir({ finalRecords });

      const records = await xata.transactions.run([
        ...finalRecords,
        {
          insert: {
            table: "opml-files",
            record: {
              username,
              userId,
              filename: fileName,
            },
          },
        },
      ]);

      // const results = await xata.transactions.run([
      //   ...r,
      //   {
      //     insert: {
      //       table: "opml-files",
      //       record: {
      //         username: "john",
      //         filename: fileName,
      //       },
      //     },
      //   },
      // ]);

      return { message: "success" };
    } else {
      return { message: "success" };
    }
  } catch (err) {
    console.log(err);
    if (err instanceof FetcherError) {
      console.log(err.status);
      console.log(err.errors);
    }

    return { message: "error" };
  }
}
