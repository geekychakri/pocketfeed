//@ts-nocheck

import * as htmlparser from "htmlparser2";
import FeedParser from "feedparser";
import Pinkie_Promise from "pinkie-promise";

const rssTypes = [
  "application/rss+xml",
  "application/atom+xml",
  "application/rdf+xml",
  "application/rss",
  "application/atom",
  "application/rdf",
  "text/rss+xml",
  "text/atom+xml",
  "text/rdf+xml",
  "text/rss",
  "text/atom",
  "text/rdf",
];

const iconRels = [
  // "apple-touch-icon", //TODO:
  // "apple-touch-icon-precomposed",
  "icon",
  "shortcut icon",
];

const imageRels = [
  "og:image:secure_url",
  "og:image:url",
  "og:image",
  "twitter:image",
  "twitter:image:src",
  "thumbnail",
  "parsely-image-url",
  "sailthru.image.full",
];

const rssIcon = ["icon", "svg", "jpg", "png"];

export function htmlParser(htmlBody, feedParserOptions) {
  return new Pinkie_Promise(function (resolve, reject) {
    var rs = {};
    var feeds = [];
    var parser;
    var isFeeds;
    var favicon;
    var image;
    var isRssIcon = (link) => rssIcon.some((icon) => link.includes(icon));
    var isSiteTitle;
    var siteTitle = null;
    var feedParser;

    parser = new htmlparser.Parser(
      {
        onopentag: function (name, attr) {
          if (/(feed)|(atom)|(rdf)|(rss)/.test(name)) {
            isFeeds = true;
          }

          if (
            name === "link" &&
            rssTypes.indexOf(attr.type) !== -1 &&
            attr.href
          ) {
            feeds.push({
              title: attr.title || null,
              url: attr.href,
            });
          }

          if (
            name === "link" &&
            (iconRels.indexOf(attr.rel) !== -1 || attr.type === "image/x-icon")
          ) {
            console.log(attr.href);
            favicon = attr.href;
          }

          if (
            name === "meta" &&
            (imageRels.indexOf(attr.property) !== -1 ||
              imageRels.indexOf(attr.name) !== -1)
          ) {
            image = attr.content;
          }

          if (name === "title" && siteTitle === null) {
            isSiteTitle = true;
          }

          // console.log("NEW CODE BLOCK")
          if (attr.href && attr.href.includes("rss") && !isRssIcon(attr.href)) {
            feeds.push({
              title: attr.title || null,
              url: attr.href,
            });
          }
        },
        ontext: function (text) {
          if (isSiteTitle) {
            console.log({ text }); //TODO:
            siteTitle = text;
            isSiteTitle = false;
          }
        },
        onclosetag: function (name) {
          if (name === "title") {
            isSiteTitle = false;
          }
        },
      },
      {
        recognizeCDATA: true,
      },
    );

    parser.write(htmlBody);
    parser.end();

    if (isFeeds) {
      feedParser = new FeedParser(feedParserOptions);

      feeds = [];

      feedParser.on("error", function (err) {
        reject(err);
      });

      feedParser.on("readable", function () {
        var data;

        if (feeds.length === 0) {
          data = this.meta;
          feeds.push(data);
        }
      });

      feedParser.write(htmlBody);

      feedParser.end(function () {
        if (feeds.length !== 0) {
          rs.site = {
            title: feeds[0].title || null,
            favicon: feeds[0].favicon || null,
            image: feeds[0].image || null,
            url: feeds[0].link || null,
          };

          rs.feedUrls = [
            {
              title: feeds[0].title || null,
              url: feeds[0].xmlUrl || null,
            },
          ];
        }

        resolve(rs);
      });
    } else {
      rs.site = {
        title: siteTitle || null,
        favicon: favicon || null,
        image: image || null,
      };

      rs.feedUrls = feeds;

      resolve(rs);
    }
  });
}
