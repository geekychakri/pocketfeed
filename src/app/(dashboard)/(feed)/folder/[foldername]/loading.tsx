// import { SpinnerRotate } from "@/components/SpinnerRotate";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// export default function Loading() {
//   return (
//     <div className="flex h-screen w-full flex-col p-4">
//       <SkeletonTheme
//         baseColor="var(--background-secondary)"
//         highlightColor="var(--skeleton-highlight)"
//         height={25}
//       >
//         {/* <p>
//           <Skeleton count={3} />
//         </p> */}

//         <div className="flex flex-col gap-4">
//           <Skeleton width={150}></Skeleton>
//           {Array.from({ length: 50 }, (_, i) => i + 1).map((_, i) => {
//             return (
//               <div key={i} className="flex flex-col gap-2">
//                 <Skeleton className="flex-1"></Skeleton>
//               </div>
//             );
//           })}
//         </div>
//       </SkeletonTheme>
//     </div>
//   );
// }

// import { SpinnerRotate } from "@/components/SpinnerRotate";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// export default function Loading() {
//   return (
//     <div className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center overflow-hidden">
//       <SpinnerRotate />
//     </div>
//   );
// }

import LoadingUI from "@/components/loading-ui";

export default function Loading() {
  return <LoadingUI className="h-screen" />;
}
