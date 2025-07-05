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

// import TestChild from "./components/test-child";
"use client";
import { useEffect, useState } from "react";

import useSWR from "swr";

import {
  useSetCookie,
  useGetCookie,
  useDeleteCookie,
} from "cookies-next/client";
import AriaFileUpload from "@/components/aria-file-upload";

class StatusError extends Error {
  info: string | undefined;
  status: number | undefined;
}

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const error = new StatusError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// export default function Test() {
//   const [inngestExecutionId, setInngestExecutionId] = useState<string | null>(
//     "",
//   );

//   const setCookie = useSetCookie();
//   const getCookie = useGetCookie();
//   const deleteCookie = useDeleteCookie();

//   const inngestId = getCookie("inngestExecutionId");

//   console.log({ inngestId });

//   const [isCompleted, setIsCompleted] = useState(false);

//   const {
//     data,
//     error: embedError,
//     isLoading,
//   } = useSWR(
//     inngestExecutionId || inngestId
//       ? `/api/getInngestStatus/${inngestExecutionId || inngestId}`
//       : null,
//     fetcher,
//     {
//       // keepPreviousData: true,
//       refreshInterval: isCompleted ? 0 : 1000,
//       dedupingInterval: 0,
//       revalidateOnFocus: false,
//       // revalidateOnMount: true,
//       onSuccess(data, key, config) {
//         if (data?.status === "Completed") {
//           // setInngestExecutionId(null);
//           setIsCompleted(true);
//           // deleteCookie("inngestExecutionId");
//         }
//       },
//     },
//   );

//   console.log({ data });

//   const handleClick = async () => {
//     const res = await fetch("/api/hello");
//     const data = await res.json();
//     console.log(data);
//     setInngestExecutionId(data.id);
//     setCookie("inngestExecutionId", data.id);
//   };

//   useEffect(() => {
//     if (data?.status === "Completed") {
//       deleteCookie("inngestExecutionId");
//     }
//   }, [data]);

//   return (
//     <div>
//       <button onClick={handleClick}>Submit</button>
//       <div>Status - {isLoading ? "..." : data?.status}</div>
//     </div>
//   );
// }

export default function Test() {
  return (
    <div>
      Test
      <AriaFileUpload />
    </div>
  );
}
