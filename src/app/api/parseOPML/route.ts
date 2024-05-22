import path from "path";

import xml2js from "xml2js";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("opmlFile") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileData = buffer.toString("utf8");

  function extractFeeds(outline: any) {
    let feeds = [];

    if (outline.outline) {
      for (let subOutline of outline.outline) {
        if (subOutline.$.type === "rss") {
          const attributes = subOutline.$;
          const feedtype =
            path.extname(attributes.xmlUrl) === ".json" ? "json" : "text";
          feeds.push({
            name: attributes.title,
            url: attributes.htmlUrl,
            feed: attributes.xmlUrl,
            // feedType: feedtype,
          });
        }
      }
    } else {
      feeds.push({
        name: outline.$.title,
        url: outline.$.htmlUrl,
        feed: outline.$.xmlUrl,
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

  //   xml2js.parseString(fileData, function (err, result) {
  //     console.log(result.opml.body[0].outline[0].outline);

  //     data = result.opml.body[0].outline[0].outline
  //       .map((item) => item["$"])
  //       .map((item) => item.text);
  //     console.log(data);
  //   });

  // Parse the OPML file
  let result = await xml2js.parseStringPromise(fileData);

  const feeds = [];
  for (let outline of result.opml.body[0].outline) {
    console.log(outline);
    feeds.push(...extractFeeds(outline));
  }

  return Response.json(feeds);

  //   xml2js.parseString(fileData, (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }

  //     const feeds = [];
  //     for (let outline of result.opml.body[0].outline) {
  //       console.log(outline);
  //       feeds.push(...extractFeeds(outline));
  //     }
  //   });
}
