import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-[50%]" />
            <Skeleton className="h-3 w-[20%]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSkeleton;
