import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
 
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { Post } from "../types/post.types";
import { formatTimeAgo } from "../utils/timeFormatter";
import { PostMenuModal } from "./modals/PostMenuModal";
import {
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";
import { useGetAuthUserQuery} from "../services/userApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CommentPostModal from "./modals/CommentPostModal";
import Comment from "./Comment";

interface PostCardProps {
  post: Post;
}

const UserPostCard: React.FC<PostCardProps> = ({ post }) => {
  const { data: authData } = useGetAuthUserQuery();

  const authUser = authData?.user;
  const navigate = useNavigate();
  
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const [isPostMenuOpen, setIsPostMenuOpen] = useState<boolean>(false);
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();
  let isLiked = post.likes.some(
    (id) => id.toString() === authUser?._id?.toString()
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  let isBookmarked = authUser?.bookmarks?.some(
    (id) => id.toString() === post._id.toString()
  );
useEffect(() => {
console.log("post", post)

}, [])
  const handleBookmark = async () => {
    console.log("hi", isBookmarked);
    const data = await toggleBookmarkPost(post._id).unwrap();
    console.log("data", data);
    toast.success(isBookmarked ? "Post is unbookmarked" : "Post is bookmarked");
  };

  const handleLike = async () => {
   await toggleLikePost({
      postId: post._id,
      userId: authUser?._id,
    }).unwrap();
  };

  const handleRouteToProfile = () => {
    navigate(`/profile/${post.author.userName}`);
  };

  return (
    <article className="bg-card border border-border rounded-lg mb-5  w-sm sm:w-full  mx-auto">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div
            onClick={handleRouteToProfile}
            className="cursor-pointer w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full overflow-hidden "
          >
            <img
              src={post.author.profilePic}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div>
            <p
              onClick={handleRouteToProfile}
              className=" cursor-pointer font-semibold text-xs sm:text-sm text-foreground"
            >
              {post.author.userName}
            </p>
            {/* {post.location && (
              <p className="text-xs text-muted-foreground">{post.location}</p>
            )} */}
          </div>
        </div>
        <MoreHorizontal
          onClick={() => setIsPostMenuOpen(true)}
          className="w-4 h-4 cursor-pointer text-muted-foreground"
        />
      </div>

      <PostMenuModal
        postId={post._id}
        postOwnerName={post.author.userName}
        isOpen={isPostMenuOpen}
        onClose={() => setIsPostMenuOpen(false)}
      />

      <div className="w-full h-65 sm:h-75 md:h-80 overflow-hidden">
        {post.media[0].type === "image" ? (
          <img
            src={post.media[0].url}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={post.media[0].url}
            muted
            playsInline
            loop
            controls
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <div className="flex items-center gap-3">
            <button disabled={isLikeLoading} onClick={handleLike}>
              <Heart
                className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-colors text-primary
   ${
     isLiked
       ? "fill-primary " // filled when liked
       : ""
   }     
  `}
              />
            </button>

            <button onClick={() => setIsCommentModalOpen(true)}>
              <MessageCircle
                className={`h-4.5 w-4.5 sm:h-5 sm:w-5 text-primary `}
              />
            </button>

            {/* <Send className="w-5 h-5 cursor-pointer text-foreground" /> */}
          </div>
          <button onClick={handleBookmark} disabled={isBookmarkLoading}>
            <Bookmark
              className={`h-4.5 w-4.5 sm:h-5 sm:w-5 text-primary transition-colors ${
                isBookmarked ? "fill-primary" : ""
              }`}
            />
          </button>
        </div>
        {isCommentModalOpen && (
          <CommentPostModal
            handleRouteToProfile={handleRouteToProfile}
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            post={post}
            isBookmarked={isBookmarked}
            isBookmarkLoading={isBookmarkLoading}
            isLiked={isLiked}
            isLikeLoading={isLikeLoading}
            handleLike={handleLike}
            handleBookmark={handleBookmark}
          />
        )}
        <p className="font-semibold text-xs sm:text-sm mb-1 text-foreground">
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </p>

        {post.caption && (
          <p className="text-xs sm:text-sm mb-0 sm:mb-1 text-foreground">
            <span className="font-semibold mr-1">{post.author.userName}</span>
            {post.caption}
          </p>
        )}

        <p className="text-[0.68rem] sm:text-xs text-muted-foreground ">
          {formatTimeAgo(post.createdAt)} ago
        </p>
      </div>

      {post.comments.length > 0 && (
        <div className="px-4 pb-1.5 sm:pb-3 space-y-0.5 sm:space-y-1.5">
          {post.comments.map((comment) => (
            <Comment
              key={comment._id}
              text={comment.text}
              author={comment.author}
              likes={comment.likes}
              createdAt={comment.createdAt}
              handleRouteToProfile={handleRouteToProfile}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default UserPostCard;
