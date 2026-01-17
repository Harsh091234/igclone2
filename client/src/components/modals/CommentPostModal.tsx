import React, { useEffect, useRef, useState } from "react";
// components/PostDialog.tsx

import { Bookmark, Heart, X } from "lucide-react";
import Comment from "../Comment";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { formatTimeAgo } from "../../utils/timeFormatter";
import type { CommentT, Post } from "../../types/post.types";

import { useCommentPostMutation, useGetAllCommentsQuery } from "../../services/postApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  isLikeLoading: boolean;
  handleLike: () => void;
  handleBookmark: () => void;
  isBookmarkLoading: boolean;
  isBookmarked?: boolean;
  isLiked: boolean;
  handleRouteToProfile: () => void;
}


const CommentPostModal = ({
  isOpen,
  onClose,
  post,
  isLikeLoading,
  handleLike,
  handleBookmark,
  isBookmarkLoading,
  isBookmarked,
  isLiked,
  handleRouteToProfile
}: PostDialogProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
   const [api, setApi] = useState<any>(null);
   const [activeIndex, setActiveIndex] = useState(0);
    const [text, setText] = useState<string>("");
    
    const [commentPost, {isLoading: isCommentPostLoading}] = useCommentPostMutation();
    const {isLoading: isCommentsLoading, data: commentData} = useGetAllCommentsQuery(post._id)
    const  comments = commentData?.comments;

   

   const handleComment = async () => {
     try {
       if (!text.trim()) {
         return toast.error("Comment cannot be empty");
       }

       if (text.length > 200) {
         return toast.error("Comment must be under 200 characters");
       }

       await commentPost({ id: post._id, text }).unwrap();
       setText("");
     } catch (error: any) {
       console.log("error:", error?.data?.message || error.message);
     }
   };

   useEffect(() => {
     if (!api) return;

     setActiveIndex(api.selectedScrollSnap());

     api.on("select", () => {
       setActiveIndex(api.selectedScrollSnap());
     });
   }, [api]);
  // Close modal when clicking outside
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
      onClick={onClose}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-[55rem] h-[60vh] flex overflow-hidden rounded-lg shadow-lg"
      >
        {/* LEFT: Carousel */}
        <div className="w-[50%] flex items-center justify-center p-2">
          <Carousel
            setApi={setApi}
            className="w-full h-[90%] relative overflow-hidden rounded-xl"
          >
            <CarouselContent className=" ">
              {post.media.map((item, index) => (
                <CarouselItem key={index} className="">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover "
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 bg-accent/30 text-accent-foreground rounded-full p-3 hover:bg-accent/50   z-10 shadow-sm">
              ‹
            </CarouselPrevious>

            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 bg-accent/30 text-accent-foreground rounded-full p-3 hover:bg-accent/50 z-10 shadow-sm">
              ›
            </CarouselNext>

            {/* Optional Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
              {post.media.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeIndex ? "bg-accent scale-125" : "bg-accent/40"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* RIGHT: Comments */}
        <div className="w-[50%] flex flex-col border-l">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <img
                onClick={handleRouteToProfile}
                src={post.author.profilePic}
                className="cursor-pointer h-8 w-8 rounded-full"
              />
              <p
                onClick={handleRouteToProfile}
                className="cursor-pointer font-semibold text-sm"
              >
                {post.author.userName}
              </p>
            </div>
            <X className="cursor-pointer" onClick={onClose} />
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {isCommentsLoading ? (
              <>Loading...</>
            ) : (
              comments.map((comment: CommentT) => (
                <Comment
                  handleRouteToProfile={handleRouteToProfile}
                  key={comment._id}
                  author={comment.author}
                  text={comment.text}
                  likes={comment.likes}
                  createdAt={comment.createdAt}
                />
              ))
            )}
          </div>
          {/* extra option */}
          <div className="px-3 py-2">
            <div className="flex flex-col  mb-1">
              <div className="flex items-center gap-3">
                <button disabled={isLikeLoading} onClick={handleLike}>
                  <Heart
                    className={`h-5 w-5 transition-colors text-primary
   ${
     isLiked
       ? "fill-primary " // filled when liked
       : ""
   }     
  `}
                  />
                </button>

                <button onClick={handleBookmark} disabled={isBookmarkLoading}>
                  <Bookmark
                    className={`w-5 h-5 text-primary transition-colors ${
                      isBookmarked ? "fill-primary" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="font-semibold text-sm mb-1 text-foreground">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </p>

              <div className="flex justify-between ">
                {post.caption && (
                  <p className="text-sm mb-1 text-foreground">
                    <span className="font-semibold mr-1">
                      {post.author.userName}
                    </span>
                    {post.caption}
                  </p>
                )}

                <p className="text-xs text-muted-foreground ">
                  {formatTimeAgo(post.createdAt)} ago
                </p>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="flex justify-between border-t text-sm px-4 py-3">
            <input
              placeholder="Add a comment..."
              className="w-full  outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleComment}
              disabled={isCommentPostLoading}
              className="
    text-sm relative
    disabled:cursor-not-allowed
    disabled:opacity-50
    after:absolute after:left-0 after:bottom-0 after:h-[1px]
    after:w-0 after:bg-primary after:transition-all after:duration-300
    hover:after:w-full
    disabled:hover:after:w-0
  "
            >
              {isCommentPostLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPostModal;
