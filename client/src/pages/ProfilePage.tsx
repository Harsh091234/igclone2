import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, PlaySquare, SettingsIcon, Tag } from "lucide-react";
// import Highlights from "../components/Highlights";
import PostCard from "../components/PostCard";

import {
  useFollowOrUnfollowUsersMutation,
  
  useGetProfileUserQuery,
} from "../services/userApi";

import { Button } from "../components/ui/button";
// import { Separator } from "@radix-ui/react-separator";
import ProfilePageSkeleton from "../components/Skeletons/ProfilePageSkeleton";
import NoUserFound from "../components/NoUserFound";
import {
  useGetUserPostsQuery,
  useGetUserReelsQuery,
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";

import UserPostsSkeleton from "../components/Skeletons/UserPostsSkeleton";
import type { Post } from "../types/post.types";
import CommentPostModal from "../components/modals/CommentPostModal";
import toast from "react-hot-toast";
import FollowingModal from "../components/modals/FollowingModal";
import FollowersModal from "../components/modals/FollowersModal";
import { useGetMeQuery } from "../services/authApi";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

const getLimit = () => {
  const width = window.innerWidth;

  if (width < 640) return 9; // mobile
  if (width < 1024) return 12; // tablet (sm/md)
  return 7; // desktop (lg+)
};

const ProfilePage = () => {
  const { name } = useParams<{ name: string }>();
  if (!name) return;
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(getLimit());

  const postBlockRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();
  const { data: authData, isLoading: isAuthLoading } = useGetMeQuery(undefined);
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileUserQuery(name);
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "tagged">(
    "posts",
  );
  const authUser = authData?.user;
  
  const user = profileData?.user;
  console.log("profile user", user)
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();

  const { isFetching: isPostsFetching, data: postData } = useGetUserPostsQuery(
    { id: user?._id, page, limit },
    {
      skip: !user?._id || activeTab !== "posts",
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: reelsData, isFetching: isReelsFetching } = useGetUserReelsQuery(
    { id: user?._id, page, limit },
    {
      skip: !user?._id || activeTab !== "reels",
      refetchOnMountOrArgChange: true,
    },
  );

  console.log("reels:", reelsData);

  const isLoadingCurrent =
    activeTab === "reels" ? isReelsFetching : isPostsFetching;

  const [isFollowingModalOpen, setIsFollowingModalOpen] =
    useState<boolean>(false);
  const [isFollowerModalOpen, setIsFollowerModalOpen] =
    useState<boolean>(false);

  console.log("postdata", postData);

  const [toggleFollow, { isLoading: followLoading }] =
    useFollowOrUnfollowUsersMutation();

    const getId = (u: any) => (typeof u === "string" ? u : u?._id);
    const isFollowing = (user?.followers ?? []).some(
  (f: any) => getId(f) === authUser?._id
);

  const displayPosts =
    activeTab === "reels" ? (reelsData?.reels ?? []) : (postData?.posts ?? []);
  const activePost = displayPosts.find((p: Post) => p._id === activePostId);
  const isLoading = isAuthLoading || isProfileLoading;
  const isAuthUser = authUser?._id === user?._id;
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const authFollowingIds = authUser?.following?.map((u: any) => u._id) ?? [];
  const handleRouteToProfile = () => {
    navigate(`/profile/${user?.userName}`);
  };

  const handleFollow = async (targetUserId: string) => {
  try {
    await toggleFollow({
      userId: targetUserId,
      userName: name,
    }).unwrap();
  } catch (err) {
    console.log(err);
  }
};

  const handleClick = (url: string) => {
    navigate(`/settings/${url}`);
  };

  
  const handleBookmark = async (postId: string) => {
    const isBookmarked = authUser?.bookmarks?.some(
      (id: any) => id.toString() === postId.toString(),
    );

    await toggleBookmarkPost(postId).unwrap();

    toast.success(isBookmarked ? "Post is unbookmarked" : "Post is bookmarked");
  };

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getLimit();
      setLimit((prev) => (prev !== newLimit ? newLimit : prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = postBlockRef.current;
    if (!container) return;

    const onScroll = () => {
      const hasMore =
        activeTab === "reels"
          ? (reelsData?.hasMore ?? true)
          : (postData?.hasMore ?? true);

      if (!container || isLoadingCurrent || !hasMore) return;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeTab, reelsData?.hasMore, postData?.hasMore, isLoadingCurrent]);

  useEffect(() => {
    if (!isLoadingCurrent) {
      isFetchingRef.current = false;
    }
  }, [isLoadingCurrent]);

  useEffect(() => {
    setPage(1);

    isFetchingRef.current = false;
  }, [activeTab, user?._id, limit]);

  if (isLoading) return <ProfilePageSkeleton />;
  if (!user) return <NoUserFound />;

  return (
    <div
      ref={postBlockRef}
      className="h-[100dvh] overflow-y-auto my-scroll
     flex justify-center px-3 sm:px-30  py-3   sm:py-0"
    >
      <div className=" w-full max-w-full h-full   sm:max-w-4xl mt-7   sm:mt-13 ">
        {/* TOP SECTION */}

        <div className="flex flex-col  sm:flex-row sm:items-center gap-3 sm:gap-30  mb-4 sm:mb-8">
          <img
            src={user.profilePic || "/default user.jpg"}
            alt="Profile"
            className="w-20 h-20 sm:w-32 sm:h-32 md:h-39 md:w-39 rounded-full object-cover border border-zinc-700 mx-auto sm:mx-0"
          />

          <div className="flex-1 flex flex-col sm:justify-between">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 sm:mb-4">
              <div className="flex items-center gap-8">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  @{user.userName}
                </h2>

                {isAuthUser && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleClick("edit-profile")}
                      className="
      px-2 sm:px-4 py-1.5 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200 hidden sm:flex
    "
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleClick("")}
                      className="
      px-2 sm:px-4 py-1.5 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200 sm:hidden
    "
                    >
                      <SettingsIcon className="h-4 w-4" />
                    </button>

                    {/* <button
                      className="
      px-4 py-1 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200
    "
                      onClick={handleClick}
                    >
                      Settings
                    </button> */}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 sm:mb-4 text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg">
                {user.fullName}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm">
                {user.bio || "No bio yet"}
              </p>
            </div>

            <div className="flex text-sm sm:text-base justify-center sm:justify-start gap-6  mb-5">
              <button>
                <strong>{user.posts?.length}</strong> posts
              </button>
              <button
                onClick={() => {
                  if ((user.followers?.length ?? 0) > 0) {
                    setIsFollowerModalOpen(true);
                  }
                }}
              >
                <strong>{user.followers?.length || 0}</strong> followers
              </button>
              <button
                onClick={() => {
                  if ((user.following?.length ?? 0) > 0) {
                    setIsFollowingModalOpen(true);
                  }
                }}
              >
                <strong>{user.following?.length || 0}</strong> following
              </button>
            </div>
            {isFollowerModalOpen && (
              <FollowersModal
                onClose={() => setIsFollowerModalOpen(false)}
                isFollowing={isFollowing}
                handleFollow={handleFollow}
                userName={name}
                authUserId={authUser?._id}
                authFollowing={authFollowingIds}
              />
            )}
            {isFollowingModalOpen && (
              <FollowingModal
              user={user}
                onClose={() => setIsFollowingModalOpen(false)}
                userName={user.userName}
                authUserId={authUser?._id}
                authFollowing={authFollowingIds}
                handleFollow={handleFollow}
              />
            )}
            {!isAuthUser && (
              <div className="flex items-center gap-3">
                <Button
                  disabled={followLoading}
                  onClick={() => handleFollow(user._id)}
                  className={`w-28 border text-sm justify-center transition-colors ${
                    isFollowing
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>

                <Button
                  onClick={() => navigate(`/messages?user=${user.userName}`)}
                  variant="outline"
                  className="text-sm w-28 justify-center"
                >
                  Message
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* <div className="relative">
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full relative"
          >
            <CarouselContent className="ml-0  sm:px-6">
              {highlightsData.map((h, i) => (
                <CarouselItem key={i} className="basis-[90px] sm:basis-[130px]">
                  <Highlights title={h.title} img={h.img} />
                </CarouselItem>
              ))}
            </CarouselContent>

          
            <CarouselPrevious className="hidden md:flex -left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border-border shadow-sm" />
            <CarouselNext className="hidden md:flex -right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border-border shadow-sm" />
          </Carousel>
        </div> */}

        {/* <Separator className="my-4 bg-muted-foreground/20 h-0.5 rounded-full" /> */}

        {/* TABS */}
        <div className="relative flex justify-around mb-4 border-b">
          {/* Sliding underline */}
          <span
            className={`absolute bottom-0 h-[1px] sm:h-[2px] w-1/3 bg-foreground transition-transform duration-300 ease-out
      ${
        activeTab === "posts"
          ? "translate-x-[-100%]"
          : activeTab === "reels"
            ? "translate-x-0"
            : "translate-x-[100%]"
      }`}
          />

          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1 px-4 py-2 text-xs sm:text-sm ${
              activeTab === "posts"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Posts
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1 px-4 py-2 text-xs sm:text-sm ${
              activeTab === "reels"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Reels
          </button>

          <button
            onClick={() => setActiveTab("tagged")}
            className={`flex items-center gap-1 px-4 py-2 text-xs sm:text-sm ${
              activeTab === "tagged"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Tagged
          </button>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-1 mt-2 pb-18 sm:pb-8">
          {isLoadingCurrent && displayPosts.length === 0 ? (
            // ✅ Initial loading
            <UserPostsSkeleton />
          ) : displayPosts.length > 0 ? (
            <>
              {/* ✅ Posts */}
              {displayPosts.map((post: Post) => {
                const media =
                  activeTab === "reels"
                    ? post.media.find((m) => m.type === "video")
                    : post.media[0];

                if (!media) return null;

                return (
                  <PostCard
                    key={post._id}
                    onClick={() => setActivePostId(post._id)}
                    url={media.url}
                    type={media.type}
                  />
                );
              })}

              {/* ✅ Infinite scroll loading */}
              {isLoadingCurrent && <UserPostsSkeleton />}
            </>
          ) : (
            // ❌ Empty state
            <p className="col-span-full text-center text-sm text-muted-foreground">
              {activeTab === "reels" ? "No reels yet" : "No posts found"}
            </p>
          )}
        </div>
        {activePost && (
          <CommentPostModal
            isOpen={true}
            onClose={() => setActivePostId(null)}
            post={activePost}
            isLikeLoading={isLikeLoading}
            handleLike={() =>
              toggleLikePost({
                postId: activePost._id,
                userId: authUser?._id,
                profileUserId: user._id,
              })
            }
            handleBookmark={() => handleBookmark(activePost._id)}
            isBookmarkLoading={isBookmarkLoading}
            isLiked={
              authUser?._id ? activePost.likes.includes(authUser._id) : false
            }
            isBookmarked={authUser?.bookmarks?.some(
              (id: any) => id.toString() === activePost._id.toString(),
            )}
            handleRouteToProfile={handleRouteToProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
