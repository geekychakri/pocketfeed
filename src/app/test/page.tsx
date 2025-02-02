"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Player from "next-video/player";

export default function Test() {
  // const findPodcast = async () => {
  //   const res = await fetch("https://jser.dev/rss.xml");
  //   const etag = res.headers.get("last-modified");
  //   console.log({ etag });
  // };

  // await findPodcast();

  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  const divRef = useRef(null);

  const articleRef = useRef(null);

  console.log({ count });

  useLayoutEffect(() => {
    return () => {
      console.log("LAYOUT EFFECT");
    };
  }, []);

  useEffect(() => {
    return () => {
      // console.log("CLEANUP");
    };
  }, []);

  return (
    <>
      {/* <div ref={(node) => {}}>
        Test
        <button onClick={() => setCount(count + 1)}>Update</button>
      </div>
      <article>Article</article>
  
      <button onClick={() => setShow(!show)}>Show</button>
      <div className="w-[500px] border">
        <Player src="https://video.bsky.app/watch/did%3Aplc%3Apa2rujri3s6l3yf5nadbg3bx/bafkreidsfpiio6guvb3dlrkphtml6vr5xx5qh5keodhelcrgmxcfzyvjuq/playlist.m3u8" />
      </div> */}
      <div>1</div>
      <div tabIndex={0}>2</div>
      <div tabIndex={4}>3</div>
      <div tabIndex={3}>4</div>
    </>
  );
}

// const Test1 = () => {
//   useLayoutEffect(() => {
//     return () => {
//       console.log("TEST Layout effect");
//     };
//   }, []);
//   return <div ref={(node) => console.log(node)}>Test</div>;
// };
