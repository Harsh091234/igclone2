import { Skeleton } from "../ui/skeleton";

const ChatListSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-1.5 md:py-3"
        >
          {/* Avatar Skeleton */}
          <Skeleton className="h-9 w-9 md:h-10 md:w-10 rounded-full" />

          {/* Text Skeleton */}
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListSkeleton;
