import { Skeleton } from "../ui/skeleton";

export const SkeletonCard = ({
  type,
}: {
  type: "portrait" | "square" | "landscape";
}) => {
  const aspectClasses = {
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    landscape: "aspect-[16/9]",
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-primary/10">
      <Skeleton className={`w-full ${aspectClasses[type]}`} />
    </div>
  );
};
