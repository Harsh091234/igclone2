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


interface PostCardProps {
  post: Post;
}

const UserPostCard: React.FC<PostCardProps> = ({
  post,
}) => {
     const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
      const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
      const [isPostMenuOpen, setIsPostMenuOpen] = useState<boolean>(false);
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
        <MoreHorizontal onClick={() => setIsPostMenuOpen(true)} 
        className="w-4 h-4 cursor-pointer text-muted-foreground" />
      </div>
    
     
          <PostMenuModal postId={post._id} postOwnerName={post.author.userName} isOpen={isPostMenuOpen} onClose={() => setIsPostMenuOpen(false)}/>
      
    
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
        {/* <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                    <Heart
                    className={`w-5 h-5 cursor-pointer ${
                        likedPosts[post._id]
                        ? "fill-destructive text-destructive"
                        : "text-foreground"
                    }`}
              onClick={() => toggleLike(post.id)}
            />
            <MessageCircle className="w-5 h-5 cursor-pointer text-foreground" />
            <Send className="w-5 h-5 cursor-pointer text-foreground" />
          </div>
          <Bookmark
            className={`w-5 h-5 cursor-pointer ${
              savedPosts[post.id]
                ? "fill-accent text-accent"
                : "text-foreground"
            }`}
            onClick={() => toggleSave(post.id)}
          />
        </div> */}

        <p className="font-semibold text-sm mb-1 text-foreground">
          {0 + post.likes} likes
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
