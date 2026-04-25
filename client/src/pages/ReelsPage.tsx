import { Heart, MessageCircle, Bookmark, Ellipsis } from "lucide-react";
import { Card } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import {
  useGetAllReelsQuery,
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";
import type { Reel } from "../types/post.types";
import ReelSkeleton from "../components/Skeletons/ReelSkeleton";
import {
  useFollowOrUnfollowUsersMutation,

  useGetProfileUserQuery,
} from "../services/userApi";
import UserAvatar from "../components/UserAvatar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReelOptionsModal from "../components/modals/ReelOptionsModal";
import CommentPostModal from "../components/modals/CommentPostModal";
import AccountInfoModal from "../components/modals/AccountInfoModal";
import { useGetMeQuery } from "../services/authApi";

const ReelsPage = () => {
  const { isLoading: isReelLoading, data: reelData } =
    useGetAllReelsQuery(undefined);

  const navigate = useNavigate();
  const { data: authData } = useGetMeQuery(undefined);
  const authUser = authData?.user;
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const reels = reelData?.videos;
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  const activeReel = reels?.find((r: Reel) => r._id === activeReelId);
  let isLiked;

  const [isReelModalOpen, setIsReelModalOpen] = useState<boolean>(false);
  const [toggleFollow, { isLoading: isFollowLoading }] =
    useFollowOrUnfollowUsersMutation();
  const isFollowedForModal =
    activeReel?.author.followers?.some((id: string) => id === authUser?._id) ??
    false;
  const { isLoading: isUserLoading, data: userData } = useGetProfileUserQuery(
    activeReel?.author.userName ?? "",
    { skip: !activeReel },
  );
  const user = userData?.user;
  
  const handleRouteToProfile = (userName: string) => {
    navigate(`/profile/${userName}`);
  };

  const handleLike = (postId: string) => {
    console.log(postId);
    toggleLikePost({
      postId: postId,
      userId: authUser?._id ?? "",
    }).unwrap();
  };

  const handleBookmark = (postId: string) => {
    const isBookmarked = authUser?.bookmarks?.includes(postId) ?? false;

    toggleBookmarkPost(postId).unwrap();
    toast.success(isBookmarked ? "Post is unbookmarked" : "Post is bookmarked");
  };

 const handleFollow = async (userId: string, userName: string) => {
  await toggleFollow({ userId, userName }).unwrap();
};

  return (
    <div className="flex justify-center pb-10 sm:pb-0 px-2 items-start sm:items-center text-foreground h-[108dvh] sm:min-h-screen   bg-primary-foreground">
      <Carousel
        orientation="vertical"
        className="w-full  bg  sm:w-[300px] lg:w-[420px] "
      >
        <CarouselContent className=" h-[94.6vh]  sm:h-[80vh] lg:h-[89vh] ">
          {isReelLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="h-full w-full">
                <ReelSkeleton />
              </CarouselItem>
            ))}

            {!isReelLoading && reels?.length === 0 && (
  <div className="h-full w-full flex items-center justify-center text-center">
    <p className="text-sm sm:text-base text-muted-foreground">
      No reels available
    </p>
  </div>
)}

          {!isReelLoading &&  reels?.length > 0 &&
            reels.map((reel: Reel) => {
              isLiked = reel.likes?.some(
                (id) => id === authUser?._id.toString(),
              );
              const isAuthUser = reel.author._id === authUser?._id;
              const isBookmarked =
                authUser?.bookmarks?.includes(reel._id) ?? false;
              const isFollowed =
                reel.author.followers?.some((id) => id === authUser?._id) ??
                false;
              return (
                <CarouselItem
                  key={reel._id}
                  className="h-full w-full  items-center flex max-sm:pt-0"
                >
                  <Card className="border-0 bg-black sm:bg-card sm:border relative flex items-center h-full w-full rounded-none sm:rounded-xl overflow-hidden">
                    {/* Video */}
                    <video
                      src={reel.video.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full sm:bg-black object-contain"
                    />

                    {/* Right Actions */}
                    <div className="absolute right-3 bottom-6 sm:bottom-13 z-60 flex flex-col items-center gap-2 sm:gap-2.5">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(reel._id)}
                        disabled={isLikeLoading}
                        className="text-white transition-colors duration-200 hover:text-white/60 active:text-white/60"
                      >
                        <Heart
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isLiked ? "fill-white" : ""
                          } transition-colors duration-200`}
                        />
                      </button>
                      <span className="text-xs text-white">
                        {reel.likes?.length}
                      </span>

                      {/* Comment Button */}
                      <button
                        onClick={() => {
                          setActiveReelId(reel._id);
                          setIsCommentModalOpen(true);
                        }}
                        className="text-white transition-colors duration-200 hover:text-white/60 active:text-white/60"
                      >
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200" />
                      </button>
                      <span className="text-xs text-white">
                        {reel.comments?.length}
                      </span>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => handleBookmark(reel._id)}
                        disabled={isBookmarkLoading}
                        className="text-white transition-colors duration-200 hover:text-white/60 active:text-white/60"
                      >
                        <Bookmark
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isBookmarked ? "fill-white" : ""
                          } transition-colors duration-200`}
                        />
                      </button>

                      {/* Options Button */}
                      <button
                        onClick={() => {
                          setActiveReelId(reel._id);
                          setIsReelModalOpen(true);
                        }}
                        className="text-white transition-colors duration-200 hover:text-white/60 active:text-white/60"
                      >
                        <Ellipsis className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200" />
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 sm:bottom-5.5 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col gap-1 sm:gap-2">
                      <div className="flex gap-2 sm:gap-5 items-center flex-wrap">
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <UserAvatar
                            onClick={() =>
                              handleRouteToProfile(reel.author.userName)
                            }
                            user={reel.author}
                            classes="h-7 w-7 cursor-pointer sm:h-8 sm:w-8"
                          />
                          <p
                            onClick={() =>
                              handleRouteToProfile(reel.author.userName)
                            }
                            className="text-xs cursor-pointer sm:text-sm font-semibold"
                          >
                            {reel.author.userName}
                          </p>
                        </div>
                        {!isAuthUser && (
                          <button
                            disabled={isFollowLoading}
                            onClick={() => handleFollow(reel.author._id, reel.author.userName)}
                            className={`
      text-[0.55rem] sm:text-xs
      py-0.5 sm:py-1
      px-1.5 sm:px-3
      rounded-sm sm:rounded-md
      transition-all
      ${
        isFollowed
          ? "bg-white text-black border border-white"
          : "bg-transparent text-white border border-gray-400"
      }
      ${isFollowLoading ? "opacity-50 cursor-not-allowed" : ""}
    `}
                          >
                            {isFollowed ? "Following" : "Follow"}
                          </button>
                        )}
                      </div>
                      <p className="text-[0.65rem] sm:text-xs opacity-90">
                        {reel.caption}
                      </p>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })}
        </CarouselContent>
      </Carousel>
      {isReelModalOpen && activeReel && (
        <ReelOptionsModal
          isFollowed={isFollowedForModal}
          isAuthUser={activeReel.author._id === authUser?._id}
          onClose={() => setIsReelModalOpen(false)}
          onFollow={() => handleFollow(activeReel.author._id, activeReel.author.userName)}
          onGoToPost={() => {
            setIsCommentModalOpen(true);
          }}
          onAboutThisAccount={() => setIsAccountModalOpen(true)}
        />
      )}

      {isCommentModalOpen && activeReel && (
        <CommentPostModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          post={activeReel}
          isLikeLoading={isLikeLoading}
          handleLike={() => handleLike(activeReel._id)}
          handleBookmark={() => handleBookmark(activeReel._id)}
          isBookmarkLoading={isBookmarkLoading}
          isBookmarked={authUser?.bookmarks?.includes(activeReel._id)}
          isLiked={!!authUser?._id && activeReel.likes.includes(authUser._id)}
          handleRouteToProfile={() =>
            navigate(`/profile/${activeReel.author.userName}`)
          }
        />
      )}

      {isAccountModalOpen && activeReel && (
        <AccountInfoModal
          user={user ?? undefined}
          isLoading={isUserLoading}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReelsPage;
