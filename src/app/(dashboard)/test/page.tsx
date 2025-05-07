// "use client";

// import { useEffect, useLayoutEffect, useRef, useState } from "react";

// import Player from "next-video/player";

// import { useRouter } from "next/navigation";

// export default function Test() {
//   // const findPodcast = async () => {
//   //   const res = await fetch("https://jser.dev/rss.xml");
//   //   const etag = res.headers.get("last-modified");
//   //   console.log({ etag });
//   // };

//   // await findPodcast();

//   const [count, setCount] = useState(0);
//   const [show, setShow] = useState(false);

//   const router = useRouter();

//   const divRef = useRef(null);

//   const articleRef = useRef(null);

//   console.log({ count });

//   useLayoutEffect(() => {
//     return () => {
//       console.log("LAYOUT EFFECT");
//     };
//   }, []);

//   useEffect(() => {
//     return () => {
//       // console.log("CLEANUP");
//     };
//   }, []);

//   return (
//     <>
//       {/* <div ref={(node) => {}}>
//         Test
//         <button onClick={() => setCount(count + 1)}>Update</button>
//       </div>
//       <article>Article</article>

//       <button onClick={() => setShow(!show)}>Show</button>
//       <div className="w-[500px] border">
//         <Player src="https://video.bsky.app/watch/did%3Aplc%3Apa2rujri3s6l3yf5nadbg3bx/bafkreidsfpiio6guvb3dlrkphtml6vr5xx5qh5keodhelcrgmxcfzyvjuq/playlist.m3u8" />
//       </div> */}
//       <div>1</div>
//       <div tabIndex={0}>2</div>
//       <div tabIndex={4}>3</div>
//       <div tabIndex={3}>4</div>

//       <div>Count - {count}</div>

//       <button onClick={() => setCount((c) => c + 1)}>Inc count</button>

//       <button onClick={() => window.location.reload()}>Refresh</button>
//     </>
//   );
// }

// const Test1 = () => {
//   useLayoutEffect(() => {
//     return () => {
//       console.log("TEST Layout effect");
//     };
//   }, []);
//   return <div ref={(node) => console.log(node)}>Test</div>;
// };

"use client";

// import { useFullscreen } from "@/store/read-fullscreen";
// import { useEffect, useState } from "react";

// import useStore from "@/store/useStore";

// export default function Test() {
//   const [show, setShow] = useState(false);
//   // const { fullscreen, toggleFullscreen } = useFullscreen();
//   const fullscreen = useStore(useFullscreen, (state) => state.fullscreen);
//   // console.log({ fullscreen });
//   // useEffect(() => {
//   //   setShow(true);
//   // }, []);
//   return (
//     <div>
//       <div
//         className={`${fullscreen ? "opacity-0" : "opacity-1"} transition-all duration-1000`}
//       >
//         Hello
//       </div>
//     </div>
//   );
// }

"use client";

// import TestChild from "./components/test-child";

export default function Test() {
  console.log("RENDERED");
  //
  return <div>hey</div>;
}
