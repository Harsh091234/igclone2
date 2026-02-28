import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

export const StoriesSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CarouselItem key={index} className="basis-[70px] sm:basis-[80px]">
          <div className="flex flex-col items-center gap-1">
            {/* Avatar circle skeleton */}
            <div className="rounded-full bg-muted p-[3px]">
              <Skeleton className="bg-primary/10 w-11 h-11 sm:w-13 sm:h-13 rounded-full" />
            </div>

            {/* Username skeleton */}
            <Skeleton className="bg-primary/10 h-3 w-12 rounded-md" />
          </div>
        </CarouselItem>
      ))}
    </>
  );
};
