import { getXataClient } from "@/xata";
import Parser from "rss-parser";
import Link from "next/link";
import RouteBack from "@/components/RouteBack/RouteBack";

const xata = getXataClient();
const parser = new Parser();

export default async function Feed({
  params,
}: {
  params: { feedname: string };
}) {
  const feedTitle = params.feedname.split("-").join(" ").trim();
  //   console.log(feedTitle);
  const feed = await xata.db.feeds
    .filter({
      username: "test",
      title: { $iContains: feedTitle },
    })
    .getMany();
  //   console.log(feed[0].rssURL);
  let feedList = await parser.parseURL(feed[0].rssURL as string);
  console.log(feedList);
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex gap-2">
        <RouteBack />
        <span className="font-medium">{feedList?.title}</span>
      </div>
      {/* <p>{params.feedname.split("-").join(" ")}</p> */}
      {feedList.items.map((item, i) => (
        <Link
          href={`/read/${encodeURIComponent(item.link as string)}`}
          key={i}
          className="rounded-md border p-2"
        >
          <p>{item.title}</p>
          {/* <p>{JSON.stringify(item.enclosure)}</p>
          <audio src={item.enclosure?.url} controls></audio> */}
          {/* <p>{item.content}</p> */}
        </Link>
      ))}
    </div>
  );
}
