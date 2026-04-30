import React, { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
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
import { getAspectClass } from "../utils/aspectHelper";

interface PostCardProps {
  post: Post;
}

const UserPostCard: React.FC<PostCardProps> = ({ post }) => {
  const { data: authData } = useGetMeQuery(undefined);
  console.log("post",post)
  const authUser = authData?.user;
  const navigate = useNavigate();
  const [deleteComment] = useDeleteCommentMutation();
  const [toggleBookmarkPost, { isLoading: isBookmarkLoading }] =
    useToggleBookmarkPostMutation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState<boolean>(false);
  const [toggleLikePost, { isLoading: isLikeLoading }] =
    useToggleLikePostMutation();
  let isLiked = post.likes?.some(
    (id) => id.toString() === authUser?._id?.toString(),
  );
  const [open, setOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null,
  );
  let isBookmarked = authUser?.bookmarks?.some(
    (id: string) => id.toString() === post._id.toString(),
  );
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
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
      { threshold: 0.5 }, // 50% visible triggers
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [post.media.length]);

  return (
    <article className="bg-card border border-border rounded-lg mb-5  sm:w-lg lg:w-md xl:w-full   max-w-2xl">
      <div
        className="flex 
      
      
      items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <div
            onClick={handleRouteToProfile}
            className="cursor-pointer w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full overflow-hidden "
          >
            <img
              src={post.author?.profilePic}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div>
            <p
              onClick={handleRouteToProfile}
              className=" cursor-pointer font-semibold text-xs sm:text-sm text-foreground"
            >
              {post.author?.userName}
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
        postOwnerName={post.author?.userName}
        isOpen={isPostMenuOpen}
        onClose={() => setIsPostMenuOpen(false)}
      />

      <div className="w-full overflow-hidden">
        {post.media.length === 1 ? (
          <div className={`flex justify-center items-center`}  style={{
    aspectRatio: post.media[0].feedRatio,
  }}>
            {post.media[0].type === "image" ? (
              <img
                src={post.media[0].url}
                alt="post-media"
                className="h-full w-full object-cover"
              />
            ) : (
              <VideoPlayer src={post.media[0].url} className="h-full w-full" />
            )}
          </div>
        ) : (
          <>
            <Carousel className="w-full ">
              <CarouselContent ref={carouselRef} className="-ml-0">
                {post.media.map((item, index) => (
                  <CarouselItem
                    key={index}
                    data-carousel-item
                    data-index={index}
                    className="pl-0"
                  >
                    <div className="flex justify-center items-center aspect-video">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={`post-media-${index}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <VideoPlayer
                          src={item.url}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10" />
              <CarouselNext className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10" />
              <div className="flex absolute  bottom-3 sm:bottom-4 w-full justify-center   gap-1">
                {post.media.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-primary"
                        : "bg-muted-foreground"
                    }`}
                  ></span>
                ))}
              </div>
            </Carousel>
          </>
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
          <p className="text-xs wrap-break-word sm:text-sm mb-0 sm:mb-1 text-foreground">
            <span className="font-semibold mr-1">{post.author?.userName}</span>
            {post.caption}
          </p>
        )}

        <p className="text-[0.68rem] sm:text-xs text-muted-foreground ">
          {formatTimeAgo(post.createdAt)}
        </p>
      </div>

      {post.comments.length > 0 && (
        <div className="px-4 pb-1.5 sm:pb-3 space-y-0.5 sm:space-y-1.5">
          {post?.comments?.map((comment) => (
            <Comment
              key={comment._id}
              isDeleting={deletingCommentId === comment._id}
              onDelete={() => {
                setSelectedCommentId(comment._id);
                setOpen(true);
              }}
              text={comment.text}
              author={comment.author}
              likes={comment.likes}
              createdAt={comment.createdAt}
              handleRouteToProfile={handleRouteToProfile}
            />
          ))}
        </div>
      )}
      {
        <CustomConfirmModal
          open={open}
          onConfirm={() => {
            handleDeleteComment();
          }}
          onCancel={() => {
            setSelectedCommentId(null);
            setOpen(false);
          }}
          text={"Are u sure want to delete?"}
        />
      }
    </article>
  );
};

export default UserPostCard;
