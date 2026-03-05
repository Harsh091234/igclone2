interface ViewerSkeletonProps {
  count?: number;
}

export function ViewerSkeleton({ count = 5 }: ViewerSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-4 py-3 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      ))}
    </>
  );
}
