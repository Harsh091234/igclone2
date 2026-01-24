import { useEffect, useRef, useState } from "react";
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
import type { CommentT, Post, Reel } from "../../types/post.types";

import {
  useCommentPostMutation,
  useGetAllCommentsQuery,
} from "../../services/postApi";
import toast from "react-hot-toast";
import VideoPlayer from "../VideoPlayer";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | Reel;
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
  handleRouteToProfile,
}: PostDialogProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [text, setText] = useState<string>("");

  const [commentPost, { isLoading: isCommentPostLoading }] =
    useCommentPostMutation();
  const { isLoading: isCommentsLoading, data: commentData } =
    useGetAllCommentsQuery(post._id);
  const comments = commentData?.comments;

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

  const mediaList = (() => {
    // Reel → single video
    if ("video" in post && post.video) {
      return [
        {
          type: "video",
          url: post.video.url,
        },
      ];
    }

    // Post → multiple media
    if ("media" in post && Array.isArray(post.media)) {
      return post.media;
    }

    return [];
  })();

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
      className="fixed inset-0  p-2 z-50 flex items-center justify-center bg-black/50 "
      onClick={onClose}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-[45rem] h-[90vh] sm:h-[60vh] flex flex-col sm:flex-row relative overflow-hidden rounded-lg shadow-lg"
      >
        {/* LEFT: Carousel */}
        <div className="w-full sm:w-1/2 h-60 sm:h-full flex bg-green-500 items-center justify-center p-2">
          <Carousel
            setApi={setApi}
            className="flex h-full w-full justify-center bg-violet-600 rounded-lg overflow-hidden"
          >
            <CarouselContent className="h-full bg-red-400">
              {mediaList.map((item, index) => (
                <CarouselItem key={index}>
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <VideoPlayer
                      className="w-full h-full bg-black"
                      src={item.url}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 bg-accent/30 text-accent-foreground rounded-full p-3 hover:bg-accent/50 z-10 shadow-sm">
              ‹
            </CarouselPrevious>
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 bg-accent/30 text-accent-foreground rounded-full p-3 hover:bg-accent/50 z-10 shadow-sm">
              ›
            </CarouselNext>

            {/* Optional Dots Indicator */}
            {mediaList.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                {mediaList.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeIndex
                        ? "bg-accent scale-125"
                        : "bg-accent/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>

        {/* RIGHT: Comments */}
        <div className="w-full sm:w-1/2 flex flex-col h-full border-l overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <img
                onClick={handleRouteToProfile}
                src={post.author?.profilePic ?? "/default-avatar.png"}
                className="cursor-pointer h-8 w-8 rounded-full"
              />
              <p
                onClick={handleRouteToProfile}
                className="cursor-pointer font-semibold text-sm"
              >
                {post.author?.userName ?? "Unknown"}
              </p>
            </div>
            <X className="cursor-pointer" onClick={onClose} />
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
            {isCommentsLoading ? (
              <p className="text-muted-foreground">Loading comments...</p>
            ) : (
              comments?.map((comment) => (
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

          {/* Likes & Caption */}
          <div className="px-4 py-2 border-t flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <div className="flex gap-3">
                <button disabled={isLikeLoading} onClick={handleLike}>
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`}
                  />
                </button>
                <button disabled={isBookmarkLoading} onClick={handleBookmark}>
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-primary" : ""}`}
                  />
                </button>
              </div>

              <span className="text-xs font-semibold">
                {post?.likes?.length} likes
              </span>
            </div>
            {post.caption && (
              <p className="text-xs">
                <span className="font-semibold">{post.author?.userName}</span>{" "}
                {post.caption}
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="px-4 py-2.5 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            <button
              onClick={handleComment}
              disabled={isCommentPostLoading}
              className="text-blue-500 text-sm disabled:opacity-50"
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
