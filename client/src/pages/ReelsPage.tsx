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
  console.log("reels", reels)
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
  console.log("current reel:", activeReel)
  return (
    <div className="flex justify-center pb-10 sm:pb-0 px-2 items-start sm:items-center text-foreground h-screen   bg-primary-foreground">
      <Carousel
        orientation="vertical"
       className="w-full sm:w-[300px] lg:w-[420px] h-[800px]"
      >
        <CarouselContent className="w-full h-[800px] ">
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
                  className="h-full overflow-hidden w-full  items-center flex max-sm:pt-0"
                >
               <Card className="border-0 p-0 rounded-2xl overflow-hidden bg-black aspect-9/16 w-full">
  <div className=" w-full h-full relative">
    
    {/* Video */}
    <video
      src={reel.video.url}
      autoPlay
      loop
      muted
      playsInline
      className={`absolute inset-0 w-full h-full ${
        reel.video.aspect === "9/16"
          ? "object-cover"
          : "object-contain"
      }`}
    />

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
