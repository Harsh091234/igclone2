import { Skeleton } from "../ui/skeleton";

const FullPostSkeleton = () => {
  return (
    <article className="bg-card border border-border rounded-lg mb-3 max-w-[500px] mx-auto p-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <Skeleton className="bg-primary/10 w-8 h-8 rounded-full" />

          <div className="flex flex-col gap-1">
            <Skeleton className="bg-primary/10  h-3 w-20 rounded" />
            <Skeleton className="bg-primary/10  h-2 w-14 rounded" />
          </div>
        </div>

       
      </div>

      {/* Media */}
      <Skeleton className="bg-primary/10  w-full h-60 rounded" />

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className=" bg-primary/10  w-5 h-5 rounded-full" />
            <Skeleton className=" bg-primary/10  w-5 h-5 rounded-full" />
            <Skeleton className=" bg-primary/10  w-5 h-5 rounded-full" />
          </div>
         
        </div>

        {/* Likes */}
        <Skeleton className="h-3 w-16  bg-primary/10 rounded" />

        {/* Caption */}
        <Skeleton className="h-3 w-full bg-primary/10  rounded" />
       

        
      </div>
    </article>
  );
};

export default FullPostSkeleton;
