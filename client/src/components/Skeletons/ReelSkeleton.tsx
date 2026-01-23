import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ReelSkeleton = () => {
  return (
    <Card className="border-0 bg-primary-foreground min-[350px]:bg-card min-[350px]:border relative flex items-center h-full w-full rounded-none min-[350px]:rounded-xl overflow-hidden">
      {/* Video skeleton */}
      <Skeleton className="h-full w-full rounded-none" />

      {/* Right action buttons */}
     

      {/* Bottom info */}
      <div className="absolute bottom-6 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
         
        </div>

        <Skeleton className="h-3 w-[90%]" />
        <Skeleton className="h-3 w-[70%] mt-1" />
      </div>
    </Card>
  );
};

export default ReelSkeleton;
