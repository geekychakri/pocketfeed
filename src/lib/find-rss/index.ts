//@ts-nocheck

import { htmlParser } from "./parser";
import extend from "extend";
import Promise from "pinkie-promise";
import url from "node:url";
import got from "got";

// function resolve(from, to) {
//   const resolvedUrl = new URL(to, new URL(from, "resolve://"));
//   if (resolvedUrl.protocol === "resolve:") {
//     // `from` is a relative URL.
//     const { pathname, search, hash } = resolvedUrl;
//     return pathname + search + hash;
//   }
//   console.log({ resolvedUrl });
//   return resolvedUrl.toString();
// }

function resolve(from, to) {
  const baseUrl = new URL(from);
  const resolvedUrl = new URL(to, baseUrl);
  return resolvedUrl.toString();
}

const defaults = {
  gotOptions: {
    timeout: {
      request: 30000, // 30s
    },
  },
  feedParserOptions: {},
};

function isRelativeUrl(str) {
  return /^https?:\/\//i.test(str);
}

function setError(err) {
  if (err instanceof Error) {
    return err;
  }

  return new Error(err);
}

function cleanUrl(uri) {
  if (uri[uri.length - 1] === "/") {
    return uri.substr(0, uri.length - 1);
  }

  return uri;
}

function getFaviconUrl(uri) {
  //   var parsedUrl = url.parse(uri);
  var parsedUrl = new URL(uri);
  return url.resolve(parsedUrl.protocol + "//" + parsedUrl.host, "favicon.ico");
}

function fixData(res, uri) {
  return new Promise(function (resolve) {
    var feedUrl;
    var favicon;
    var i = res.feedUrls.length;

    while (i--) {
      feedUrl = res.feedUrls[i];

      if (feedUrl.url) {
        if (!isRelativeUrl(feedUrl.url)) {
          feedUrl.url = url.resolve(uri, feedUrl.url);
        }
      } else {
        feedUrl.url = uri;
      }
    }

    if (!res.site.url) {
      res.site.url = cleanUrl(uri);
    }

    if (res.site.favicon) {
      if (!isRelativeUrl(res.site.favicon)) {
        res.site.favicon = url.resolve(res.site.url, res.site.favicon);
      }

      resolve(res);
    } else {
      favicon = getFaviconUrl(res.site.url);

      console.log({ gotFavicon: favicon }); //TODO::

      got(favicon, {
        retry: {
          limit: 0,
        },
      })
        .then(function () {
          res.site.favicon = favicon;
          resolve(res);
        })
        .catch(function () {
          resolve(res);
        });
    }
  });
}

export function findRSS(opts) {
  return new Promise(function (resolve, reject) {
    var o = extend(true, {}, defaults);

    if (typeof opts === "string") {
      o.url = opts;
    } else if (typeof opts === "object" && !Array.isArray(opts)) {
      o = extend(true, {}, defaults, opts);
    } else {
      reject(setError("Parameter `opts` must be a string or object."));
      return;
    }

    if (!isRelativeUrl(o.url)) {
      reject(setError("Not HTTP URL is provided."));
      return;
    }

    var canonicalUrl;

    got(o.url, o.gotOptions)
      .then(function (res) {
        canonicalUrl = res.url;
        return htmlParser(res.body, o.feedParserOptions);
      })
      .then(function (res) {
        return fixData(res, canonicalUrl);
      })
      .then(function (res) {
        resolve(res);
      })
      .catch(function (err) {
        reject(setError(err));
      });
  });
}
