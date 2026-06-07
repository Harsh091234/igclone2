import { Heart, MessageCircle, Bookmark, Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import UserAvatar from "./UserAvatar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";

import { useGetMeQuery } from "../services/authApi";

import { selectPostById } from "../redux/postSlice";
import type { RootState } from "../store/store";

interface ReelCardProps {
  reelId: string;
  onComment: (postId: string) => void;
  onOptions: (postId: string) => void;
}

const ReelCard = ({ reelId, onComment, onOptions }: ReelCardProps) => {
  const navigate = useNavigate();

  const reel = useSelector((state: RootState) => selectPostById(state, reelId));

  const { data: authData } = useGetMeQuery(undefined);

  const authUser = authData?.user;

  const [toggleLikePost] = useToggleLikePostMutation();

  const [toggleBookmarkPost] = useToggleBookmarkPostMutation();

  if (!reel) return null;

  const isLiked = !!authUser?._id && reel.likes.includes(authUser._id);

  const isBookmarked = authUser?.bookmarks?.includes(reel._id) ?? false;

  const handleLike = async () => {
    try {
      await toggleLikePost({
        postId: reel._id,
        userId: authUser?._id ?? "",
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmarkPost(reel._id).unwrap();

      toast.success(
        isBookmarked ? "Post is unbookmarked" : "Post is bookmarked",
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRouteToProfile = () => {
    navigate(`/profile/${reel.author.userName}`);
  };

  return (
    <Card className="border-0 p-0 rounded-0 lg:rounded-2xl lg:overflow-hidden bg-black aspect-9/16 w-full">
      <div className="relative w-full h-full">
        {/* Overlay */}
        <div className="absolute inset-0 flex justify-between p-3 z-50">
          {/* Left */}
          <div className="flex flex-col justify-end gap-2 text-white text-sm">
            <div className="flex items-center gap-2">
              <UserAvatar classes="h-8 w-8" user={reel.author} />

              <p
                onClick={handleRouteToProfile}
                className="font-semibold cursor-pointer"
              >
                {reel.author.userName}
              </p>
            </div>

            {reel.caption && <p className="ml-2 text-xs">{reel.caption}</p>}
          </div>

          {/* Right */}
          <div className="flex flex-col justify-end items-center gap-4 text-white">
            <button onClick={handleLike}>
              <Heart className={`h-7 w-7 ${isLiked ? "fill-white" : ""}`} />
            </button>

            <button onClick={() => onComment(reel._id)}>
              <MessageCircle className="h-7 w-7" />
            </button>

            <button onClick={handleBookmark}>
              <Bookmark
                className={`h-7 w-7 ${isBookmarked ? "fill-white" : ""}`}
              />
            </button>

            <button onClick={() => onOptions(reel._id)}>
              <Ellipsis className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Video */}
        {reel.media?.[0]?.url ? (
          <video
            src={reel.media[0].url}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full ${
              reel.media?.[0]?.aspect === "9/16"
                ? "object-cover"
                : "object-contain"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Processing...
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReelCard;
