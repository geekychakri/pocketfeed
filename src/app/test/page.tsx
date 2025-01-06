"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
      <div ref={(node) => {}}>
        Test
        <button onClick={() => setCount(count + 1)}>Update</button>
      </div>

      <article>Article</article>

      {/* {show ? <Test1 /> : null} */}
      <button onClick={() => setShow(!show)}>Show</button>
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
