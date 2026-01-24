import { X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface SkeletonProps{
    onClose: () => void;
}

const AccountInfoModalSkeleton = ({onClose}: SkeletonProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[92%] max-w-[420px] bg-card text-card-foreground rounded-xl shadow-lg p-3"
      >
        {/* Header */}
        <div className="flex justify-center relative mb-3">
          <Skeleton className="h-5 w-40 rounded bg-primary/10" />
          <button onClick={onClose}>
            <X className="h-5 w-5 right-0 absolute top-0 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <div className="my-3 h-px bg-border" />

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-3 min-[300px]:mb-10">
          <Skeleton className="bg-primary/10 h-12 w-12 min-[300px]:h-14 min-[300px]:w-14 rounded-full" />

          <div className="flex flex-col items-center gap-1">
            <Skeleton className="bg-primary/10 h-4 w-28 rounded" />
            <Skeleton className="bg-primary/10 h-3 w-36 rounded" />
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-4 text-sm px-3 pb-2">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center flex-col min-[300px]:flex-row gap-1 min-[300px]:gap-3"
            >
              <Skeleton className="bg-primary/10 h-4 w-4 rounded" />
              <Skeleton className="bg-primary/10 h-3 w-24 rounded" />
              <Skeleton className="bg-primary/10 h-3 w-20 rounded min-[300px]:ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModalSkeleton;
