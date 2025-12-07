const SearchUserSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-lg animate-pulse">
      {/* Profile picture skeleton */}
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>

      <div className="flex flex-col gap-2.5">
        {/* Username skeleton */}
        <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>

        {/* Fullname skeleton */}
        <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default SearchUserSkeleton;
