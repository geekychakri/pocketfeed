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
//           <Skeleton width={250}></Skeleton>
//           {Array.from({ length: 10 }, (_, i) => i + 1).map((_, i) => {
//             return (
//               <div key={i} className="flex flex-col gap-2">
//                 <Skeleton width={150}></Skeleton>
//                 <Skeleton className="flex-1"></Skeleton>
//                 <Skeleton className="flex-1"></Skeleton>
//               </div>
//             );
//           })}
//         </div>
//       </SkeletonTheme>
//     </div>
//   );
// }

import LoadingUI from "@/components/loading-ui";

export default function Loading() {
  return <LoadingUI className="h-screen" />;
}
