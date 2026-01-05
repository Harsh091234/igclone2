import { Skeleton } from "../ui/skeleton";



const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen flex justify-center px-6 py-6">
      <div className="w-full max-w-4xl mt-10">
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-24 mb-8">
          {/* Avatar */}
          <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto sm:mx-0" />

          <div className="flex-1">
            {/* Username + buttons */}
            <div className="flex items-center gap-6 mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>

            {/* Full name + bio */}
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-72 mb-4" />

            {/* Stats */}
            <div className="flex gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="flex gap-4 mb-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex justify-around border-t border-border mb-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
