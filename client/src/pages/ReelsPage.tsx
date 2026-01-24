
import { Heart, MessageCircle, Send, Bookmark, VolumeX, Ellipsis } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";


import { useGetAllReelsQuery, useToggleBookmarkPostMutation, useToggleLikePostMutation } from "../services/postApi";
import type { Reel } from "../types/post.types";
import ReelSkeleton from "../components/Skeletons/ReelSkeleton";
import { useFollowOrUnfollowUsersMutation, useGetAuthUserQuery } from "../services/userApi";
import UserAvatar from "../components/UserAvatar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReelOptionsModal from "../components/modals/ReelOptionsModal";



const ReelsPage = () => {
  const {isLoading: isReelLoading, data: reelData } = useGetAllReelsQuery(undefined);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  const navigate = useNavigate();
  const { data: authData } = useGetAuthUserQuery();
   const authUser = authData?.user;
  const [toggleLikePost, {isLoading: isLikeLoading}] = useToggleLikePostMutation();
 const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const reels = reelData?.videos;
 
  console.log("reel data", reelData)
  let  isLiked;
  
  const [isReelModalOpen, setIsReelModalOpen] = useState<boolean>(false);
  const [toggleFollow, {isLoading: isFollowLoading}] = useFollowOrUnfollowUsersMutation();
 const isFollowedForModal =
   activeReel?.author.followers?.some((id) => id === authUser?._id) ?? false;

  const handleRouteToProfile = (userName: string) => {
    navigate(`/profile/${userName}`)
  }

  const handleLike = (postId: string) => {
    console.log(postId)
    toggleLikePost({
      postId: postId,
      userId: authUser?._id

    }).unwrap();
  }

  const handleBookmark = (postId: string) => {
     const isBookmarked = authUser?.bookmarks?.includes(postId) ?? false;

     toggleBookmarkPost(postId).unwrap();
    toast.success(isBookmarked ? "Post is unbookmarked" : "Post is bookmarked");
  }

  const handleFollow = async(userId:string) => {
    

    await toggleFollow(userId).unwrap();


  }

  return (
    <div className="flex justify-center pb-10 sm:pb-0 items-center text-foreground h-full bg-primary-foreground">
      <Carousel
        orientation="vertical"
        className="w-full min-[350px]:w-[300px] sm:w-[400px] "
      >
        <CarouselContent className="h-[80vh] sm:h-[94vh]">
          {isReelLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="h-full w-full">
                <ReelSkeleton />
              </CarouselItem>
            ))}
          {!isReelLoading &&
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
                <CarouselItem key={reel._id} className="h-full w-full">
                  <Card className="border-0 bg-primary-foreground min-[350px]:bg-card min-[350px]:border relative flex items-center h-full w-full rounded-none min-[350px]:rounded-xl overflow-hidden">
                    {/* Video */}
                    <video
                      src={reel.video.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-fill"
                    />

                    {/* Right Actions */}
                    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-2 sm:gap-2.5">
                      <button
                        onClick={() => handleLike(reel._id)}
                        disabled={isLikeLoading}
                        className="text-white hover:bg-white/10"
                      >
                        <Heart
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isLiked ? "fill-white " : ""
                          }`}
                        />
                      </button>

                      <span className="text-xs text-white">
                        {reel.likes?.length}
                      </span>

                      <button className="text-white hover:bg-white/10">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      <span className="text-xs text-white">
                        {reel.comments?.length}
                      </span>

                      <button
                        onClick={() => handleBookmark(reel._id)}
                        disabled={isBookmarkLoading}
                      >
                        <Bookmark
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-colors ${
                            isBookmarked ? "fill-white" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => {
                          setActiveReel(reel);
                          setIsReelModalOpen(true);
                        }}
                      >
                        <Ellipsis className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-6 sm:bottom-5.5 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col gap-1 sm:gap-2">
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
                            onClick={() => handleFollow(reel.author._id)}
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
          onFollow={() => handleFollow(activeReel.author._id)}
        />
      )}
    </div>
  );
};



export default ReelsPage
