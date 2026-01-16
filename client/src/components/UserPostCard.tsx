import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { Post } from "../types/post.types";
import { formatTimeAgo } from "../utils/timeFormatter";
import { PostMenuModal } from "./modals/PostMenuModal";
import { useToggleLikePostMutation } from "../services/postApi";
import { useGetAuthUserQuery } from "../services/userApi";
import { data } from "react-router-dom";


interface PostCardProps {
  post: Post;
}

const UserPostCard: React.FC<PostCardProps> = ({
  post,
}) => {
  const {data: authData} = useGetAuthUserQuery();
  const authUser = authData?.user;
  
      const [isPostMenuOpen, setIsPostMenuOpen] = useState<boolean>(false);
      const [toggleLikePost, {isLoading: isLikeLoading}] = useToggleLikePostMutation();
      let isLiked = post.likes.includes(authUser?._id || "" );

      
      const handleLike = async() => {
      
        console.log("hi", isLiked)
        const data = await toggleLikePost({postId: post._id, userId: authUser?._id }).unwrap();
        console.log("data", data)
      }


  return (
    <article className="bg-card border border-border rounded-lg mb-5 max-w-[500px] mx-auto">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden ">
            <img
              src={post.author.profilePic}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
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

      <div className="w-full h-90 overflow-hidden">
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button disabled={isLikeLoading} onClick={handleLike}>
              <Heart
                className={`h-5 w-5 cursor-pointer transition-colors
   ${
     isLiked
       ? "fill-primary text-primary" // filled when liked
       : ""
   }     
  `}
              />
            </button>

            <button>
              <MessageCircle className="w-5 h-5 cursor-pointer text-foreground" />
            </button>

            {/* <Send className="w-5 h-5 cursor-pointer text-foreground" /> */}
          </div>
          <Bookmark
            className={`w-5 h-5 cursor-pointer 
            `}
          />
        </div>

        <p className="font-semibold text-sm mb-1 text-foreground">
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </p>

        {post.caption && (
          <p className="text-sm mb-1 text-foreground">
            <span className="font-semibold mr-1">{post.author.userName}</span>
            {post.caption}
          </p>
        )}

        <p className="text-xs text-muted-foreground ">
          {formatTimeAgo(post.createdAt)} ago
        </p>
      </div>
    </article>
  );
};

export default UserPostCard;
