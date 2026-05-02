import React, { useEffect, useRef, useState } from "react";
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
  useDeleteCommentMutation,
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CommentPostModal from "./modals/CommentPostModal";
import Comment from "./Comment";
import VideoPlayer from "./VideoPlayer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import CustomConfirmModal from "./modals/CustomConfirmModal";
import { useGetMeQuery } from "../services/authApi";

interface PostCardProps {
  post: Post;
}

const UserPostCard: React.FC<PostCardProps> = ({ post }) => {
  const { data: authData } = useGetMeQuery(undefined);
  const authUser = authData?.user;
  const navigate = useNavigate();
  console.log("post in card:", post)
  const [deleteComment] = useDeleteCommentMutation();
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isLiked = post.likes?.some(
    (id) => id.toString() === authUser?._id?.toString()
  );

  const isBookmarked = authUser?.bookmarks?.some(
    (id: string) => id.toString() === post._id.toString()
  );

const MediaBox = ({
  children,
  ratio,
}: {
  children: React.ReactNode;
  ratio?: string;
}) => (
  <div className="w-full bg-black overflow-hidden flex items-center justify-center">
    <div
      className="w-full"
      style={{
        aspectRatio: ratio || "1 / 1",
        position: "relative",
      }}
    >
      {children}
    </div>
  </div>
);

  const handleBookmark = async () => {
    await toggleBookmarkPost(post._id).unwrap();
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

  const handleDeleteComment = async () => {
    if (!selectedCommentId) return;

    try {
      setDeletingCommentId(selectedCommentId);
      await deleteComment(selectedCommentId).unwrap();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  // ✅ Carousel observer
  useEffect(() => {
    const items = carouselRef.current?.querySelectorAll("[data-carousel-item]");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setCurrentSlide(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [post.media.length]);

  return (
    <article className="bg-card border border-border rounded-lg mb-5 max-w-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div
            onClick={handleRouteToProfile}
            className="cursor-pointer w-8 h-8 rounded-full overflow-hidden"
          >
            <img
              src={post.author?.profilePic}
              className="w-full h-full object-cover"
            />
          </div>

          <p
            onClick={handleRouteToProfile}
            className="cursor-pointer font-semibold text-sm"
          >
            {post.author?.userName}
          </p>
        </div>

        <MoreHorizontal
          onClick={() => setIsPostMenuOpen(true)}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <PostMenuModal
        postId={post._id}
        postOwnerName={post.author?.userName}
        isOpen={isPostMenuOpen}
        onClose={() => setIsPostMenuOpen(false)}
      />

      {/* MEDIA */}
      <div className="w-full">
        {post.media.length === 1 ? (
          <MediaBox ratio={post.media[0].feedRatio}>
            {post.media[0].type === "image" ? (
              <img
                src={post.media[0].url}
               className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <VideoPlayer
                src={post.media[0].url}
               className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </MediaBox>
        ) : (
          <Carousel className="w-full">
            <CarouselContent ref={carouselRef} className="-ml-0">
              {post.media.map((item, index) => (
                <CarouselItem
                  key={index}
                  data-carousel-item
                  data-index={index}
                  className="pl-0"
                >
                  <MediaBox ratio={item.feedRatio}>
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoPlayer
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </MediaBox>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full" />
            <CarouselNext className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full" />

            {/* DOTS */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {post.media.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentSlide ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        )}
      </div>

      {/* ACTIONS */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button disabled={isLikeLoading} onClick={handleLike}>
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </button>

            <button onClick={() => setIsCommentModalOpen(true)}>
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          <button onClick={handleBookmark} disabled={isBookmarkLoading}>
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-black" : ""}`} />
          </button>
        </div>

        <p className="font-semibold text-sm mt-1">
          {post.likes.length} likes
        </p>

        {post.caption && (
          <p className="text-sm">
            <span className="font-semibold mr-1">
              {post.author?.userName}
            </span>
            {post.caption}
          </p>
        )}

        <p className="text-xs text-gray-500">
          {formatTimeAgo(post.createdAt)}
        </p>
      </div>

      {/* COMMENTS */}
      {post.comments.length > 0 && (
        <div className="px-3 pb-3">
          {post.comments.map((comment) => (
            <Comment
              key={comment._id}
              isDeleting={deletingCommentId === comment._id}
              onDelete={() => {
                setSelectedCommentId(comment._id);
                setOpen(true);
              }}
              {...comment}
              handleRouteToProfile={handleRouteToProfile}
            />
          ))}
        </div>
      )}

      <CustomConfirmModal
        open={open}
        onConfirm={handleDeleteComment}
        onCancel={() => {
          setSelectedCommentId(null);
          setOpen(false);
        }}
        text="Are you sure want to delete?"
      />

      {isCommentModalOpen && (
        <CommentPostModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          post={post}
          isBookmarked={isBookmarked}
          isBookmarkLoading={isBookmarkLoading}
          isLiked={isLiked}
          isLikeLoading={isLikeLoading}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
          handleRouteToProfile={handleRouteToProfile}
        />
      )}
    </article>
  );
};

export default UserPostCard;