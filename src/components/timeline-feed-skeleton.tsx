export default function TimelineFeedSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-5">
      {Array.from({ length: 50 }, (_, i) => {
        return (
          <div key={i} className="animate-pulse flex gap-4 px-4">
            <div className="size-11 rounded-full bg-skeleton-highlight shrink-0"></div>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full h-6 bg-skeleton-highlight rounded-md"></div>
              <div className="w-full h-25 bg-skeleton-highlight rounded-md"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
