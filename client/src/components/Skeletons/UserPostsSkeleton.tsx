
import { Skeleton } from "../ui/skeleton";

const UserPostsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-square overflow-hidden rounded-xl shadow"
        >
          <Skeleton
            className="
              w-full h-full
              bg-primary/10
              dark:bg-muted/40
            "
          />
        </div>
      ))}
    </>
  );
};

export default UserPostsSkeleton;
