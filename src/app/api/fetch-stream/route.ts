// import Parser from "rss-parser";

// let parser = new Parser();

import { XMLParser } from "fast-xml-parser";
import { parseFeed } from "feedsmith";
import { PartialXMLStreamParser } from "partial-xml-stream-parser";
import { parseString } from "xml2js";

const parser = new XMLParser();

export async function GET(request: Request) {
  const parser = new PartialXMLStreamParser();
  const controller = new AbortController();
  const maxBytes = 100 * 1024; // 30 KB
  let receivedBytes = 0;
  let accumulatedData = "";
  const decoder = new TextDecoder("utf-8");
  try {
    const res = await fetch(
      `https://shoptalkshow.com/feed/podcast/default-podcast/`,
      {
        signal: controller.signal,
        cache: "no-store",
      },
    );
    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulatedData += decoder.decode(value, { stream: true });
      receivedBytes += value.length; // count how many bytes received so far
      //    accumulatedData += decoder.decode(value, { stream: true });
      console.log(`Received ${value.length} bytes, total: ${receivedBytes}`);
      if (receivedBytes >= maxBytes) {
        console.log(`Reached ${maxBytes} bytes — aborting fetch.`);
        controller.abort(); // this stops the fetch
        break;
      }
    }

    // console.log({ accumulatedData });

    // const text =
    //   '<?xml version="1.0" encoding="utf-8"?>\n' +
    //   '<feed xmlns="http://www.w3.org/2005/Atom">\n' +
    //   "  <title>Sara Soueidan — UI developer</title>\n" +
    //   "  <subtitle></subtitle>\n" +
    //   '  <link href="https://www.sarasoueidan.com/blog/index.xml" rel="self"/>\n' +
    //   '  <link href="https://www.sarasoueidan.com/"/>\n' +
    //   "  <updated>2025-09-17T00:00:00Z</updated>\n" +
    //   "  <id>https://www.sarasoueidan.com/</id>\n" +
    //   "  <author>\n" +
    //   "    <name>Sara Soueidan</name>\n" +
    //   "    <email>hello@sarasoueidan.com</email>\n" +
    //   "  </author>\n" +
    //   "  \n" +
    //   "  <entry>\n" +
    //   "    <title>CSS to speech: alternative text for CSS-generated content</title>\n" +
    //   '    <link href="https://www.sarasoueidan.com/blog/alt-text-for-css-generated-content/"/>\n' +
    //   "    <updated>2025-09-17T00:00:00Z</updated>\n" +
    //   "    <id>https://www.sarasoueidan.com/blog/alt-text-for-css-generated-content/</id>\n" +
    //   '    <content type="html"></content></entry></feed>';

    // const correctedFeedData = closeTruncatedFeed(accumulatedData);

    // console.log({ correctedFeedData });

    // const f = parser.parse(correctedFeedData as unknown as string);

    // console.log({ f });

    // const { feed } = parseFeed(correctedFeedData);

    // console.log({ feed: feed });

    // const { format, feed } = parseFeed(accumulatedData);
    // console.log({ feed });

    let result1 = parser.parseStream(accumulatedData);
    result1 = parser.parseStream(null); // End stream
    // console.log(JSON.stringify(result1, null, 2));

    console.log(feedJsonToRssParserFormat(result1)?.items);

    // parseString(accumulatedData, function (err, result) {
    //   console.log({ result: result });
    // });

    // console.log({ accumulatedData });

    return Response.json({ msg: "hello" });
  } catch (err) {
    console.log({ Error: err });
    if (err.name === "AbortError") {
      console.log("Fetch aborted");
    }
    return Response.json({ msg: "error" }, { status: 500 });
  }
}

function feedJsonToRssParserFormat(feedJson) {
  const root = feedJson?.xml?.[0];
  if (!root) return null;

  const getText = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && "#text" in val) return val["#text"];
    return "";
  };

  const getAttr = (val, attr) => {
    if (!val) return "";
    if (Array.isArray(val)) return val[0]?.[attr] || "";
    if (typeof val === "object") return val[attr] || "";
    return "";
  };

  const htmlToSnippet = (html, maxLength = 200) => {
    const text = (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  // -------- Detect Feed Type --------
  const isAtom = !!root.feed;
  const isRss = !!root.rss;

  if (!isAtom && !isRss) return null;

  // ========== ATOM FEED ==========
  if (isAtom) {
    const feed = root.feed;

    const getLink = (link) => {
      if (!link) return "";
      if (Array.isArray(link)) {
        const self = link.find((l) => l["@rel"] === "self");
        return self ? self["@href"] : link[0]["@href"];
      }
      return link["@href"];
    };

    const entries = Array.isArray(feed.entry)
      ? feed.entry
      : feed.entry
        ? [feed.entry]
        : [];

    const items = entries.map((entry) => {
      const enclosure = entry.enclosure;
      //   const audioUrl =
      //     enclosure?.["@href"] || getAttr(entry["media:content"], "@url");

      const description =
        getText(entry["summary"]) ||
        getText(entry["content"]) ||
        getText(entry["itunes:summary"]);

      return {
        title: getText(entry.title),
        link: getLink(entry.link),
        pubDate: getText(entry.updated || entry.published),
        isoDate: getText(entry.updated || entry.published),
        id: getText(entry.id),
        author: getText(entry.author?.name) || getText(feed.author?.name) || "",
        content: getText(entry.content),
        contentSnippet: htmlToSnippet(description),
        enclosure: {
          ...enclosure,
        },
        // itunes: {
        //   duration: getText(entry["itunes:duration"]),
        //   image: getAttr(entry["itunes:image"], "@href"),
        //   summary: description,
        // },
      };
    });

    return {
      title: getText(feed.title),
      link: getLink(feed.link),
      description:
        getText(feed.subtitle) || getText(feed["itunes:summary"]) || "",
      lastBuildDate: getText(feed.updated),
      feedUrl: getLink(feed.link),
      author: getText(feed.author?.name),
      image: getAttr(feed["itunes:image"], "@href"),
      items,
    };
  }

  // ========== RSS FEED ==========
  if (isRss) {
    const channel = root.rss.channel;
    const items = Array.isArray(channel.item)
      ? channel.item
      : channel.item
        ? [channel.item]
        : [];

    const parsedItems = items.map((item) => {
      const enclosure = item.enclosure;
      const audioUrl = getAttr(enclosure, "@url");

      const description =
        getText(item["content:encoded"]) ||
        getText(item.description) ||
        getText(item["itunes:summary"]);

      return {
        title: getText(item.title),
        link: getText(item.link),
        pubDate: getText(item.pubDate),
        isoDate: new Date(getText(item.pubDate)).toISOString(),
        id: getText(item.guid?.["#text"] || item.guid),
        author: getText(item["itunes:author"] || channel["itunes:author"]),
        content: description,
        contentSnippet: htmlToSnippet(description),
        enclosure: audioUrl
          ? {
              url: audioUrl,
              type: getAttr(enclosure, "@type") || "audio/mpeg",
              length: getAttr(enclosure, "@length") || "",
            }
          : undefined,
        itunes: {
          duration: getText(item["itunes:duration"]),
          image: getAttr(item["itunes:image"], "@href"),
          summary: getText(item["itunes:summary"]) || description,
        },
      };
    });

    return {
      title: getText(channel.title),
      link: getText(channel.link),
      description:
        getText(channel.description) || getText(channel["itunes:summary"]),
      lastBuildDate: getText(channel.lastBuildDate),
      feedUrl: getAttr(channel["atom:link"], "@href"),
      author: getText(channel["itunes:author"]),
      image:
        getAttr(channel["itunes:image"], "@href") ||
        getText(channel.image?.url),
      items: parsedItems,
    };
  }

  return null;
}

function repairIncompleteXML(xmlString) {
  if (!xmlString) return "";

  // Step 1. Trim and remove invalid trailing bytes (common when stream cuts)
  xmlString = xmlString.trim();

  // Step 2. Remove any dangling partial tags at the end
  // e.g., "<item><title>abc" → removes incomplete "<title>"
  xmlString = xmlString.replace(/<[^>]*$/, "");

  // Step 3. Remove junk text *after* a closing bracket
  // Sometimes the feed ends like "</item>so" or "</rss>garbage"
  xmlString = xmlString.replace(/>([^<]*)$/, (match, trailing) => {
    // if trailing text has '<', keep it (probably part of a tag)
    return trailing && !trailing.trim().startsWith("<") ? ">" : match;
  });

  // Step 4. Track tags and balance them
  const tagPattern =
    /<([a-zA-Z0-9:_-]+)(?=[\s>])(?:(?!\/>)[^>]*)>|<\/([a-zA-Z0-9:_-]+)>/g;
  const stack = [];
  let match;

  while ((match = tagPattern.exec(xmlString))) {
    const [full, openTag, closeTag] = match;

    if (openTag && !full.endsWith("/>")) {
      // opening tag
      stack.push(openTag);
    } else if (closeTag) {
      // closing tag — remove matching open tag from stack
      const idx = stack.lastIndexOf(closeTag);
      if (idx !== -1) stack.splice(idx, 1);
    }
  }

  // Step 5. Close any remaining open tags in reverse order
  while (stack.length) {
    const tag = stack.pop();
    xmlString += `</${tag}>`;
  }

  return xmlString;
}

function closeTruncatedFeed(feedData) {}
