import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import { useGetAllReelsQuery, useToggleBookmarkPostMutation, useToggleLikePostMutation } from "../services/postApi";
import ReelSkeleton from "../components/Skeletons/ReelSkeleton";

import { useState } from "react";

import ReelCard from "../components/ReelCard";
import ReelOptionsModal from "../components/modals/ReelOptionsModal";
import CommentPostModal from "../components/modals/CommentPostModal";
import AccountInfoModal from "../components/modals/AccountInfoModal";



import { useDispatch, useSelector } from "react-redux";
import { selectPostById} from "../redux/postSlice";
import type { RootState } from "../store/store";

import {
  useFollowOrUnfollowUsersMutation,
  useGetProfileUserQuery,
} from "../services/userApi";
import { toggleBookmarkLocal } from "../redux/authSlice";


const ReelsPage = () => {
  const { isLoading: isReelLoading, data: reelData } =
    useGetAllReelsQuery(undefined);

  const dispatch = useDispatch()

  const authUser = useSelector((state: RootState) => state.auth.user);

  const reels = reelData?.posts ?? [];
  const [bookmarkPost] = useToggleBookmarkPostMutation();
  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [likePost] = useToggleLikePostMutation()

  const [toggleFollow] = useFollowOrUnfollowUsersMutation();

  const activeReel = useSelector((state: RootState) =>
    activeReelId ? selectPostById(state, activeReelId) : null,
  );

  const isFollowedForModal =
    activeReel?.author?.followers?.some((id: string) => id === authUser?._id) ??
    false;

  const { data: userData, isLoading: isUserLoading } = useGetProfileUserQuery(
    activeReel?.author?.userName ?? "",
    {
      skip: !activeReel,
    },
  );
  const isBookmarked = authUser?.bookmarks?.some((id: string) => id === activeReelId)
  const isLiked = activeReel?.likes.some((id: string) => id === authUser?._id)
  const handleFollow = async (userId: string, userName: string) => {
    try {
      await toggleFollow({
        userId,
        userName,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = async() => {
    dispatch(toggleBookmarkLocal(activeReelId))
    await bookmarkPost(activeReelId).unwrap();
  }

  const handleLike = async () => {
   
    await likePost({postId: activeReelId, userId: authUser?._id!})
  };

  return (
    <div
      className="
      flex justify-center
      pb-30 md:pb-0 lg:pb-0
      min-[390px]:px-2
      items-start lg:items-center
      text-foreground
      h-screen
      bg-primary-foreground
    "
    >
      <Carousel
        orientation="vertical"
        className="w-full min-[390px]:w-[375px] lg:w-[420px]"
      >
        <CarouselContent className="w-full h-[628px] min-[377px]:h-[95vh] lg:h-[700px]">
          {isReelLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="h-full w-full">
                <ReelSkeleton />
              </CarouselItem>
            ))}

          {!isReelLoading && reels.length === 0 && (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No reels available
              </p>
            </div>
          )}

          {!isReelLoading &&
            reels.length > 0 &&
            reels.map((reel: any) => (
              <CarouselItem
                key={reel._id}
                className="h-full overflow-hidden w-full flex"
              >
                <ReelCard
                  reelId={reel._id}
                  onComment={(id) => {
                    setActiveReelId(id);
                    setIsCommentModalOpen(true);
                  }}
                  onOptions={(id) => {
                    setActiveReelId(id);
                    setIsReelModalOpen(true);
                  }}
                />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      {/* Reel Options */}
      {isReelModalOpen && activeReel && (
        <ReelOptionsModal
          isFollowed={isFollowedForModal}
          isAuthUser={activeReel.author._id === authUser?._id}
          onClose={() => setIsReelModalOpen(false)}
          onFollow={() =>
            handleFollow(activeReel.author._id, activeReel.author.userName!)
          }
          onGoToPost={() => {
            setIsCommentModalOpen(true);
          }}
          onAboutThisAccount={() => setIsAccountModalOpen(true)}
        />
      )}

      {/* Comments */}
      {isCommentModalOpen && activeReel && (
        <CommentPostModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          post={activeReel}
          handleRouteToProfile={() => {}}
          handleBookmark={handleBookmark}

          isBookmarked={isBookmarked}
          handleLike={handleLike}
          isLiked={isLiked!}
        />
      )}

      {/* Account Info */}
      {isAccountModalOpen && activeReel && (
        <AccountInfoModal
          user={userData?.user}
          isLoading={isUserLoading}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReelsPage;
