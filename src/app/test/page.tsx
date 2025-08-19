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
// "use client";
// import { useEffect, useState } from "react";

// import useSWR from "swr";

// import {
//   useSetCookie,
//   useGetCookie,
//   useDeleteCookie,
// } from "cookies-next/client";
// import AriaFileUpload from "@/components/aria-file-upload";

// import YoutubeVideo from "youtube-video-element/react";
// import MediaThemeSutro from "player.style/sutro/react";
// import { YouTubeEmbed } from "@next/third-parties/google";

// import Modal from "@/components/Modal/Modal";

// class StatusError extends Error {
//   info: string | undefined;
//   status: number | undefined;
// }

// async function fetcher<JSON = any>(
//   input: RequestInfo,
//   init?: RequestInit,
// ): Promise<JSON> {
//   const res = await fetch(input, init);
//   if (!res.ok) {
//     const error = new StatusError("An error occurred while fetching the data.");
//     // Attach extra info to the error object.
//     error.info = await res.json();
//     error.status = res.status;
//     throw error;
//   }
//   return res.json();
// }

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

// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { cn } from "@/lib/utils";

// // Base styles for media player and provider (~400B).
// import "@vidstack/react/player/styles/base.css";
// import { MediaPlayer, MediaProvider } from "@vidstack/react";

// import "@vidstack/react/player/styles/default/theme.css";
// import "@vidstack/react/player/styles/default/layouts/audio.css";
// import "@vidstack/react/player/styles/default/layouts/video.css";

import InlineScript from "@/components/inline-script";

// import {
//   DefaultVideoLayout,
//   defaultLayoutIcons,
// } from "@vidstack/react/player/layouts/default";

export default function Test() {
  // return (

  //   <div className="mx-auto w-full max-w-[900px] bg-amber-300">
  //     Test

  //     {/* <MediaPlayer
  //       src="https://www.youtube.com/watch?v=mmq-KVeO-uU"
  //       // controls
  //       viewType="video"
  //       playsInline
  //     >
  //       <MediaProvider />
  //       <DefaultVideoLayout icons={defaultLayoutIcons} />
  //     </MediaPlayer> */}
  //     {/* <AriaFileUpload /> */}
  //     {/* <MediaThemeSutro style={{ width: "100%" }} className="aspect-video">
  //       <YoutubeVideo
  //         slot="media"
  //         src="https://www.youtube.com/watch?v=uxsOYVWclA0"
  //         playsInline
  //         crossOrigin="anonymous"
  //       ></YoutubeVideo>
  //     </MediaThemeSutro> */}
  //     {/* <YouTubeEmbed
  //       videoid="mmq-KVeO-uU"
  //       // title="HEllo"
  //       // width={100}
  //       // width="100%"
  //       style="aspect-ratio:16/9;max-width:100%"
  //       playlabel="Play"
  //       // params="controls=0"
  //     /> */}
  //     {/* <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
  //       <Modal.Button asChild>
  //         <button>Open Modal</button>
  //       </Modal.Button>
  //       <Modal.Content
  //         title="What's up?"
  //         className="bg-background-primary"
  //       ></Modal.Content>
  //     </Modal> */}
  //     {/* <DialogPrimitive.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
  //       <DialogPrimitive.Trigger>Open</DialogPrimitive.Trigger>
  //       <DialogPrimitive.Portal>
  //         <DialogPrimitive.Overlay className="bg-background-secondary/50 data-[state=open]:animate-overlayShow fixed inset-0 z-120 backdrop-blur-[1px]" />
  //         <DialogPrimitive.Content
  //           className={cn(
  //             "z-130 w-full rounded-lg bg-yellow-400 p-4 shadow-[0_8px_30px_0px_rgba(0,0,0,0.12)] focus:outline-none",
  //           )}
  //         >
  //           <YouTubeEmbed
  //             videoid="mmq-KVeO-uU"
  //             // title="HEllo"
  //             // width={100}
  //             // width="100%"
  //             style="aspect-ratio:16/9;max-width:100%"
  //             playlabel="Play"
  //             // params="controls=0"
  //           />
  //           <DialogPrimitive.Close asChild>
  //             <button
  //               className="text-text-primary hover:bg-ui-hover absolute top-2.5 right-2.5 inline-flex size-[25px] cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
  //               aria-label="Close"
  //             >
  //               Close
  //             </button>
  //           </DialogPrimitive.Close>
  //         </DialogPrimitive.Content>
  //       </DialogPrimitive.Portal>
  //     </DialogPrimitive.Root> */}
  //   </div>
  // );

  return (
    <>
      <DummyData />
      <InlineScript />
    </>
  );
}

function DummyData() {
  // const [time, setText] = useState(() => {
  //   // On client, use the initial time from the inline script
  //   if (typeof window !== "undefined" && window.__INITIAL_TEXT__) {
  //     return window.__INITIAL_TEXT__;
  //   }
  //   // On server, use the current time
  //   return new Date();
  // });
  // const secondRotation = time.getSeconds() * 6 + time.getMilliseconds() * 0.006;
  return (
    <div
      id="dummy-data"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `<pre>Hello</pre><pre>Hi</pre>` }}
    ></div>
  );
}
