import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

import { Link, useNavigate } from "react-router-dom";
import { useFetchSuggestedUsersQuery, useGetAuthUserQuery } from "../services/userApi";
import CenterLoading from "../components/CenterLoading";
import { useGetAllPostsQuery } from "../services/postApi";
import FullPostSkeleton from "../components/Skeletons/FullPostSkeleton";
import UserPostCard from "../components/UserPostCard";
import type { Post } from "../types/post.types";
import { Plus } from "lucide-react";
import type { User } from "../types/user.types";
import FollowersFollowingSkeleton from "../components/Skeletons/FollowersFollowingSkeleton";
import { ScrollArea } from "../components/ui/scroll-area";
import UserAvatar from "../components/UserAvatar";

interface Story {
  id: number;
  user: string;
  avatar: string;
  isOwn?: boolean;
}

export default function FeedPage() {
 const [visibleCount, setVisibleCount] = useState<number>(5);

 
  const { isLoading: isPostLoading, data: postData } =
    useGetAllPostsQuery(undefined);
  const {isLoading: isSuggestedUsersLoading, data: suggestedUsersData} = useFetchSuggestedUsersQuery(14);
  const suggestedUsers = suggestedUsersData?.users?? [];
  const visibleSuggestedUsers = suggestedUsers.slice(0, visibleCount);
 
  const navigate = useNavigate();
  const stories: Story[] = [
    { id: 1, user: "Your Story", avatar: "😜", isOwn: true },
    { id: 2, user: "alice_wonder", avatar: "🐱‍👤" },
    { id: 3, user: "travel_diaries", avatar: "💋" },
    { id: 4, user: "foodie_life", avatar: "😎" },
    { id: 5, user: "tech_guru", avatar: "A" },
    { id: 6, user: "fitness_pro", avatar: "J" },
    { id: 7, user: "art_daily", avatar: "I" },
  ];

  const posts = postData?.posts;
  useEffect(() => {
    const fn = () => {
      if (!isPostLoading) {
        console.log("postin feed:", posts);
      }
    };
    fn();
  }, [posts]);
  const { data } = useGetAuthUserQuery();

  const authUser = data?.user;

 const handleVisibleCount = () => {
   setVisibleCount((prev) =>
     prev === 5 ? 14 : 5,
   );
 };


  if (!authUser) return <CenterLoading />;

  return (
    // <div>
    //   <UserButton />
    // </div>
    <div className="h-full ">
      {/* Main wrapper */}
      <div className="flex gap-10  h-full  sm:px-4 ">
        {/* Feed */}
        <div className="w-full  sm:w-[70%] md:w-[55%] h-full my-scroll overflow-y-auto px-4 sm:px-0">
          {/* Stories */}
          <div className="bg-card border border-border rounded-lg mt-3 sm:mt-5  py-5 sm:py-7 mb-6">
            <Carousel opts={{ align: "start" }} className="w-full   relative">
              <CarouselContent className="ml-0 ">
                {/* ───── Your Story ───── */}
                <CarouselItem className="pl-4 basis-[70px] sm:basis-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-11 sm:w-14 h-11 sm:h-14 relative rounded-full bg-muted p-[2px]">
                      {/* + Icon */}
                      <button className="absolute z-3 -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground border border-card flex items-center justify-center">
                        <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
                      </button>
                      <div className="relative w-full h-full rounded-full bg-card overflow-hidden">
                        <img
                          src={authUser.profilePic || "/user avatar.png"}
                          alt="user image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-foreground truncate max-w-[64px]">
                      Your Story
                    </span>
                  </div>
                </CarouselItem>

                {/* ───── Other Stories ───── */}
                {stories.map((story) => (
                  <CarouselItem
                    key={story.id}
                    className="basis-[70px] sm:basis-[80px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                            {story.avatar}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-foreground truncate max-w-[64px]">
                        {story.user}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* ───── Controls ───── */}
              <CarouselPrevious className="hidden sm:flex -left-3 top-7 bg-background/80 border-border shadow-sm" />
              <CarouselNext className="hidden sm:flex -right-3 top-7 bg-background/80 border-border shadow-sm" />
            </Carousel>
          </div>

          {/* Posts */}
          {isPostLoading ? (
            <FullPostSkeleton />
          ) : posts && posts.length > 0 ? (
            <div className="">
              {posts.map((post: Post) => (
                <UserPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <p className="text-sm">No posts present on feed</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden h-full overflow-y-hidden px-6 pt-5 lg:block w-[45%]">
          <div className="">
            {/* Current User */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-14 h-14 rounded-full bg-muted flex items-center pointer justify-center text-2xl overflow-hidden"
                onClick={() => navigate(`/profile/${authUser.userName}`)}
              >
                <img
                  src={authUser.profilePic}
                  alt="Current User"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">
                  {authUser.userName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {authUser.fullName}
                </p>
              </div>
              {/* <button className="text-accent text-xs font-semibold hover:underline transition">
                Switch
              </button> */}
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4 ">
                <p className="text-muted-foreground  font-semibold text-sm">
                  Suggestions For You
                </p>
                
                  <button
                    onClick={handleVisibleCount}
                    className="text-xs mr-4 font-semibold text-muted-foreground  hover:text-foreground hover:underline transition"
                  >
                   { visibleCount === 14 ? "See Less" : "See More"}
                  </button>
              
              </div>

              {isSuggestedUsersLoading ? (
                <FollowersFollowingSkeleton />
              ) : (
                <ScrollArea className=" h-80 pr-4">
                  {visibleSuggestedUsers.map((user: User) => (
                    <Link
                      to={`/profile/${user.userName}`}
                      key={user._id}
                      className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <UserAvatar 
                      classes=""
                      user={user}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">
                          {user.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.fullName}
                        </p>
                      </div>
                      <button
                        className="text-foreground/70 text-xs font-semibold
             hover:text-foreground hover:underline
             transition-colors"
                      >
                        Follow
                      </button>
                    </Link>
                  ))}
                </ScrollArea>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-xs text-muted-foreground">
              <p className="mb-2">
                About · Help · Press · API · Jobs · Privacy
              </p>
              <p className="mb-2">
                Terms · Locations · Language · Meta Verified
              </p>
              <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
