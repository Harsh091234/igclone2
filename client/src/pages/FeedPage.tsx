import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import { Link, useNavigate } from "react-router-dom";
import {
  useFetchSuggestedUsersQuery,
  useGetAuthUserQuery,
} from "../services/userApi";
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
import AddStoryPanel from "../components/panels/AddStoryPanel";
import StoryViewerModal from "../components/modals/StoryViewerModal";
import { useGetAllUsersStoryQuery } from "../services/storyApi";

import { StoriesSkeleton } from "../components/Skeletons/StoriesSkeleton";

const getLimit = () => {
  if (window.innerWidth < 640) {
    return 2;
  } else {
    return 3;
  }
};

export default function FeedPage() {
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [isStoryPanelOpen, setIsStoryPanelOpen] = useState<boolean>(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [animateRing, setAnimateRing] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const { data } = useGetAuthUserQuery();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(getLimit());

  const feedRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const authUser = data?.user;
  const { isFetching: isPostsFetching, data: postData } = useGetAllPostsQuery({
    page,
    limit,
  });
  const { isLoading: isSuggestedUsersLoading, data: suggestedUsersData } =
    useFetchSuggestedUsersQuery(14);
  const suggestedUsers = suggestedUsersData?.users ?? [];
  const visibleSuggestedUsers = suggestedUsers.slice(0, visibleCount);
  const { isLoading: isStoryLoading, data: storyData } =
    useGetAllUsersStoryQuery(undefined);
  const storyGroups = storyData?.stories ?? [];
  const activeGroup = activeGroupId
    ? storyGroups.find((group: any) => group.user._id === activeGroupId)
    : null;
  const activeGroupIndex = storyGroups.findIndex(
    (group: any) => group.user._id === activeGroupId,
  );

  const viewerStories =
    activeGroup?.stories?.map((story: any) => ({
      ...story,
      user: activeGroup.user,
    })) ?? [];
  // console.log("viewers story", viewerStories);
  const authUserStoryGroups = storyGroups.find(
    (group: any) => group.user._id === authUser?._id,
  );
  const hasAuthStory = authUserStoryGroups?.stories?.length > 0;
  // console.log("auth user story:", authUserStoryGroups);
  const otherUsersStories = storyGroups.filter(
    (group: any) => group.user._id !== authUser?._id,
  );

  console.log("stories", storyGroups);
  const navigate = useNavigate();

  const handleCloseStoryViewer = () => {
    setActiveGroupId(null); // reset active story group
    setSelectedStoryIndex(0); // reset selected story index
    setIsStoryViewerOpen(false); // close modal
  };
  const handleVisibleCount = () => {
    setVisibleCount((prev) => (prev === 5 ? 14 : 5));
  };

  const goToPrevGroup = () => {
    if (activeGroupIndex === -1) return;

    const prevIndex = activeGroupIndex - 1;

    if (prevIndex >= 0) {
      const prevGroup = storyGroups[prevIndex];

      setActiveGroupId(prevGroup.user._id);

      // 🔥 IMPORTANT: go to LAST story of previous user
      setSelectedStoryIndex(prevGroup.stories.length - 1);
    }
  };

  const goToNextGroup = () => {
    if (activeGroupIndex === -1) return;

    const nextIndex = activeGroupIndex + 1;

    if (nextIndex < storyGroups.length) {
      const nextGroup = storyGroups[nextIndex];

      setActiveGroupId(nextGroup.user._id);
      setSelectedStoryIndex(0);
    } else {
      // 🔥 no more users → close viewer
      handleCloseStoryViewer();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getLimit();
      setLimit((prev) => {
        if (prev !== newLimit) return newLimit;
        return prev;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  // scroll logic
  useEffect(() => {
    const container = feedRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 200 &&
        postData?.hasMore &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [postData?.hasMore]);

  // reset fetching lock
  useEffect(() => {
    if (!isPostsFetching) {
      isFetchingRef.current = false;
    }
  }, [isPostsFetching]);

  useEffect(() => {
    if (activeGroupId) {
      setIsStoryViewerOpen(true);
    }
  }, [activeGroupId]);
  if (!authUser) return <CenterLoading />;

  return (
    // <div>
    //   <UserButton />
    // </div>
    <div className="min-h-screen pt-0">
      {/* Main wrapper */}
      <div className="h-full px-0 md:px-4    mx-auto w-full ">
        <div className=" grid grid-cols-1   h-full lg:grid-cols-[1fr_450px]  ">
          {/* Feed */}
          <div
            ref={feedRef}
            className="w-full  pt-0  flex flex-col  mx-auto max-w-4xl h-screen pb-12 my-scroll px-3.5 sm:px-0 overflow-y-auto"
          >
            {/* Stories */}
            <div className="bg-card w-full border border-border rounded-lg mt-3 sm:mt-5  py-5 sm:py-7 mb-6">
              <Carousel opts={{ align: "start" }} className="w-full   relative">
                <CarouselContent className="ml-0 ">
                  {/* ───── Your Story ───── */}
                  <CarouselItem className="pl-4 basis-[70px] sm:basis-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        {hasAuthStory && (
                          <svg
                            className="absolute pointer-events-none inset-0 w-full h-full -rotate-90"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="46"
                              stroke="url(#gradient)"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray="289"
                              strokeDashoffset={animateRing ? 289 : 0}
                              strokeLinecap="round"
                              className={
                                animateRing ? "animate-fillCircle" : ""
                              }
                            />
                            <defs>
                              <linearGradient
                                id="gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                              >
                                <stop offset="0%" stopColor="#feda75" />
                                <stop offset="50%" stopColor="#d62976" />
                                <stop offset="100%" stopColor="#962fbf" />
                              </linearGradient>
                            </defs>
                          </svg>
                        )}

                        <div
                          onClick={() => {
                            if (!hasAuthStory) return;
                            setActiveGroupId(authUserStoryGroups!.user._id);
                            setSelectedStoryIndex(0);
                          }}
                          className="w-12 cursor-pointer h-12 rounded-full overflow-hidden bg-card"
                        >
                          <img
                            src={authUser.profilePic || "/user avatar.png"}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        {/* {!hasAuthStory && ( */}
                        <button
                          onClick={() => setIsStoryPanelOpen(true)}
                          className="absolute z-10 -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground border border-card flex items-center justify-center"
                        >
                          <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
                        </button>
                        {/* )} */}
                      </div>
                      <span className="text-xs truncate max-w-[64px]">
                        Your Story
                      </span>
                    </div>
                  </CarouselItem>

                  {/* ───── Other Stories ───── */}
                  {isStoryLoading ? (
                    <StoriesSkeleton />
                  ) : (
                    otherUsersStories.map((group: any) => (
                      <CarouselItem
                        key={group.user._id}
                        className="basis-[70px] sm:basis-[80px]"
                      >
                        <div
                          onClick={() => {
                            setActiveGroupId(group.user._id);
                            setSelectedStoryIndex(0);
                          }}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
                            <UserAvatar
                              classes="w-11 flex sm:w-13 h-11 sm:h-13"
                              user={group.user}
                            />
                          </div>

                          <span className="text-xs text-foreground truncate max-w-[64px]">
                            {group.user.userName}
                          </span>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                {/* 
                
                  <CarouselPrevious className="hidden sm:flex -left-3 top-7 bg-background/80 border-border shadow-sm" />
                  <CarouselNext className="hidden sm:flex -right-3 top-7 bg-background/80 border-border shadow-sm" /> */}
              </Carousel>
            </div>

            {/* Posts */}
            {isPostsFetching && !postData?.posts?.length ? (
              <FullPostSkeleton />
            ) : postData?.posts?.length ? (
              <div>
                {postData.posts.map((post: Post) => (
                  <UserPostCard key={post._id} post={post} />
                ))}

                {isPostsFetching && <FullPostSkeleton />}
              </div>
            ) : (
              <div>No posts are present</div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex  px-5  w-full pt-10 ">
            <div className="w-full">
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
                    {visibleCount === 14 ? "See Less" : "See More"}
                  </button>
                </div>

                {isSuggestedUsersLoading ? (
                  <FollowersFollowingSkeleton />
                ) : (
                  <ScrollArea className=" h-80 pr-4 ">
                    {visibleSuggestedUsers.map((user: User) => (
                      <Link
                        to={`/profile/${user.userName}`}
                        key={user._id}
                        className="flex items-center gap-3 mb-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <UserAvatar classes="" user={user} />
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
      {
        <AddStoryPanel
          open={isStoryPanelOpen}
          onOpenChange={() => setIsStoryPanelOpen(false)}
          setAnimateRing={setAnimateRing}
        />
      }
      {
        <StoryViewerModal
          open={isStoryViewerOpen}
          onClose={handleCloseStoryViewer}
          stories={viewerStories}
          authUserId={authUser._id}
          initialIndex={selectedStoryIndex}
          isStoryOwner={activeGroup?.user._id === authUser?._id}
          onPrevGroup={goToPrevGroup}
          onAllStoriesEnd={goToNextGroup}
        />
      }
    </div>
  );
}
