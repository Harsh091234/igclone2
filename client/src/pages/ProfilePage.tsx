import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, PlaySquare, Tag } from "lucide-react";
import Highlights from "../components/Highlights";
import PostCard from "../components/PostCard";

import {
  useFollowOrUnfollowUsersMutation,
  useGetAuthUserQuery,
  useGetProfileUserQuery,
} from "../services/userApi";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import ProfilePageSkeleton from "../components/Skeletons/ProfilePageSkeleton";
import NoUserFound from "../components/NoUserFound";
import {
  useGetUserPostsQuery,
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";

import UserPostsSkeleton from "../components/Skeletons/UserPostsSkeleton";
import type { Post } from "../types/post.types";
import CommentPostModal from "../components/modals/CommentPostModal";
import toast from "react-hot-toast";
import FollowingModal from "../components/modals/FollowingModal";
import FollowersModal from "../components/modals/FollowersModal";

const ProfilePage = () => {
  const { name } = useParams<{ name: string }>();
  if (!name) return;
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { data: authData, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileUserQuery(name);
  const scrollRef = useRef<HTMLDivElement>(null);
  const authUser = authData?.user;

  const user = profileData?.user;
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();

  const { isLoading: isPostsLoading, data: postData } = useGetUserPostsQuery(
    user?._id,
  );
  const [isFollowingModalOpen, setIsFollowingModalOpen] =
    useState<boolean>(false);
    const [isFollowerModalOpen, setIsFollowerModalOpen] =
      useState<boolean>(false);
  const userPosts = postData?.posts;
  const activePost = userPosts?.find((p: Post) => p._id === activePostId);


  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "tagged">(
    "posts",
  );
  const [toggleFollow, { isLoading: followLoading }] =
    useFollowOrUnfollowUsersMutation();
  const isFollowing = user?.followers?.some(
    (follower) => follower._id.toString() === authUser?._id,
  );
  console.log("isfollowing", isFollowing, user);
  const filteredPosts =
    activeTab === "reels"
      ? userPosts?.filter((p: Post) => p.media.some((m) => m.type === "video"))
      : userPosts;
  const isLoading = isAuthLoading || isProfileLoading;
  const isAuthUser = authUser?._id === user?._id;
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
const authFollowingIds = authUser?.following?.map((u) => u._id) ?? [];
  const handleRouteToProfile = () => {
    navigate(`/profile/${user?.userName}`);
  };

  const handleFollow = async (targetUserId: string) => {
    await toggleFollow(targetUserId).unwrap();
  };

  const handleClick = () => {
    navigate("/settings/edit-profile");
  };

  const highlightsData = [
    {
      title: "Travel",
      img: "https://picsum.photos/200?1",
    },
    {
      title: "Travel",
      img: "https://picsum.photos/200?1",
    },
    {
      title: "Travel",
      img: "https://picsum.photos/200?1",
    },
    {
      title: "Travel",
      img: "https://picsum.photos/200?1",
    },

    {
      title: "Food",
      img: "https://picsum.photos/200?2",
    },
    {
      title: "Art",
      img: "https://picsum.photos/200?3",
    },
    {
      title: "Friends",
      img: "https://picsum.photos/200?4",
    },
    {
      title: "Pets",
      img: "https://picsum.photos/200?5",
    },
  ];


  const handleBookmark = async (postId: string) => {
    const isBookmarked = authUser?.bookmarks?.some(
      (id) => id.toString() === postId.toString(),
    );

    await toggleBookmarkPost(postId).unwrap();

    toast.success(isBookmarked ? "Post is unbookmarked" : "Post is bookmarked");
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 200;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) return <ProfilePageSkeleton />;
  if (!user) return <NoUserFound />;

  return (
    <div
      className="min-h-screen 
     flex justify-center px-30 py-6"
    >
      <div className="w-full max-w-4xl mt-13">
        {/* TOP SECTION */}

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-30 mb-8">
          <img
            src={user.profilePic || "/default user.jpg"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:h-39 md:w-39 rounded-full object-cover border border-zinc-700 mx-auto sm:mx-0"
          />

          <div className="flex-1 flex flex-col sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-8">
                <h2 className="text-2xl font-semibold">@{user.userName}</h2>

                {isAuthUser && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleClick}
                      className="
      px-4 py-1.5 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200
    "
                    >
                      Edit Profile
                    </button>

                    <button
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
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 text-center sm:text-left">
              <p className="font-semibold text-lg">{user.fullName}</p>
              <p className="text-zinc-400 text-sm">
                {user.bio || "No bio yet"}
              </p>
            </div>

            <div className="flex justify-center sm:justify-start gap-6  mb-5">
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
                userName={user.userName}
                authUserId={authUser?._id}
                authFollowing={authFollowingIds}
              />
            )}
            {isFollowingModalOpen && (
              <FollowingModal
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
                  variant="outline"
                  className="text-sm w-28 justify-center"
                >
                  Message
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* HIGHLIGHTS */}

        <div className="relative">
          {/* Left Button (hidden on mobile) */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth my-scroll px-10 "
          >
            {highlightsData.map((h, i) => (
              <Highlights key={i} title={h.title} img={h.img} />
            ))}
          </div>

          {/* Right Button (hidden on mobile) */}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4 bg-muted-foreground/20 h-0.5 rounded-full" />

        {/* TABS */}
        <div className="relative flex justify-around mb-4 border-b">
          {/* Sliding underline */}
          <span
            className={`absolute bottom-0 h-[2px] w-1/3 bg-foreground transition-transform duration-300 ease-out
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
            className={`flex items-center gap-1 px-4 py-2 text-sm ${
              activeTab === "posts"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <Grid size={16} /> Posts
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1 px-4 py-2 text-sm ${
              activeTab === "reels"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <PlaySquare size={16} /> Reels
          </button>

          <button
            onClick={() => setActiveTab("tagged")}
            className={`flex items-center gap-1 px-4 py-2 text-sm ${
              activeTab === "tagged"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            <Tag size={16} /> Tagged
          </button>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {isPostsLoading ? (
            <UserPostsSkeleton />
          ) : filteredPosts?.length ? (
            filteredPosts.map((post: Post) => {
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
            })
          ) : (
            <p className="col-span-full text-center text-sm text-muted-foreground py-10">
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
            isLiked={activePost.likes.includes(authUser?._id)}
            isBookmarked={authUser?.bookmarks?.some(
              (id) => id.toString() === activePost._id.toString(),
            )}
            handleRouteToProfile={handleRouteToProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
