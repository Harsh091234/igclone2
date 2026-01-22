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
import type { CommentT, Post } from "../../types/post.types";

import {
  useCommentPostMutation,
  useGetAllCommentsQuery,
} from "../../services/postApi";
import toast from "react-hot-toast";
import VideoPlayer from "../VideoPlayer";

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
        className="bg-card w-xs sm:w-[45rem] h-[90vh] sm:h-[60vh] flex flex-col sm:flex-row relative overflow-hidden rounded-lg shadow-lg"
      >
        <X
          className="sm:hidden z-10 right-2 top-2 absolute  cursor-pointer"
          onClick={onClose}
        />
        {/* LEFT: Carousel */}
        <div className="w-full h-[55%] sm:h-full sm:w-[50%] flex items-center justify-center p-2">
          <Carousel
            setApi={setApi}
            className=" flex h-full w-[20rem]  rounded-lg overflow-hidden "
          >
            <CarouselContent className=" h-full">
              {post.media.map((item, index) => (
                <CarouselItem key={index} className=" ">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover "
                    />
                  ) : (
                    <VideoPlayer
                      className={"w-full bg-gray-600 h-full"}
                      src={item.url}
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
        <div className="w-full  h-[45%] sm:h-full sm:w-[50%] flex flex-col border-l">
          {/* Header */}
          <div className="hidden sm:flex order-1 items-center justify-between px-4 py-3 border-b">
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
          <div className=" sm:h-full overflow-y-auto px-4 flex flex-col gap-2 order-3  sm:order-2 ">
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
          <div className="px-3 pt-2   order-2 sm:order-3">
            <div className="flex flex-col  mb-1">
              <div className="flex items-center gap-3">
                <button disabled={isLikeLoading} onClick={handleLike}>
                  <Heart
                    className={`h-4.5 sm:h-5 w-4.5 sm:w-5 transition-colors text-primary
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
                    className={`h-4.5 sm:h-5 w-4.5 sm:w-5text-primary transition-colors ${
                      isBookmarked ? "fill-primary" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="font-semibold text-xs sm:text-sm mb-1 text-foreground">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </p>

              <div className="flex justify-between ">
                {post.caption && (
                  <p className="text-xs sm:text-sm mb-1 text-foreground">
                    <span className="font-semibold mr-1">
                      {post.author.userName}
                    </span>
                    {post.caption}
                  </p>
                )}

                <p className="text-[0.65rem] sm:text-xs text-muted-foreground ">
                  {formatTimeAgo(post.createdAt)} ago
                </p>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="flex justify-between  order-4  border-t text-xs         sm:text-sm px-4 py-3">
            <input
              placeholder="Add a comment..."
              className="w-full pr-3   outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleComment}
              disabled={isCommentPostLoading}
              className="
    relative
    disabled:cursor-not-allowed
    disabled:opacity-50
    after:absolute after:left-0 after:bottom-0 after:h-[1px]
    after:w-0 after:bg-primary after:transition-all after:duration-300
    hover:after:w-full
    disabled:hover:after:w-0 text-blue-500
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
