import { useEffect, useRef, useState } from "react";
import ExploreItem from "../components/ExploreItem";
import { SkeletonCard } from "../components/Skeletons/ExploreSkeleton";
import {
  useGetAllPostsQuery,
  useToggleBookmarkPostMutation,
  useToggleLikePostMutation,
} from "../services/postApi";
import Masonry from "react-masonry-css";
import CommentPostModal from "../components/modals/CommentPostModal";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useGetMeQuery } from "../services/authApi";
const ExplorePage = () => {
  const [bookmarkPost, { isLoading: isBookmarking }] =
    useToggleBookmarkPostMutation();
  const [page, setPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // const demo = true;

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentAuthorName, setCurrentAuthorName] = useState<string>("");
  const [likePost, { isLoading: isLikeLoading }] = useToggleLikePostMutation();
  const { data: authData } = useGetMeQuery(undefined);

  const { isFetching, data: postData } = useGetAllPostsQuery(page);
  const isFetchingRef = useRef(false);

  const authUser = authData?.user;
  const breakpoints = {
    default: 4,
    1100: 3,
    768: 2,
  };
  const isLiked = selectedPost?.likes?.some(
    (id: any) => id.toString() === authUser?._id.toString(),
  );
  const isBookmarked = authUser?.bookmarks?.some(
    (id: any) => id.toString() === selectedPost?._id.toString(),
  );
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const hasMounted = useRef(false);
  const handleLike = async () => {
    if (!selectedPost || !authUser?._id) return;

    const userId = authUser._id;

    // 🔥 Optimistic UI update
    setSelectedPost((prev: any) => {
      const alreadyLiked = prev.likes.some(
        (id: any) => id.toString() === userId.toString(),
      );

      return {
        ...prev,
        likes: alreadyLiked
          ? prev.likes.filter((id: any) => id.toString() !== userId.toString())
          : [...prev.likes, userId],
      };
    });

    try {
      await likePost({
        postId: selectedPost._id,
        userId,
      }).unwrap();
    } catch (err) {
      // ❗ rollback if failed
      setSelectedPost((prev: any) => {
        const alreadyLiked = prev.likes.some(
          (id: any) => id.toString() === userId.toString(),
        );

        return {
          ...prev,
          likes: alreadyLiked
            ? prev.likes.filter(
                (id: any) => id.toString() !== userId.toString(),
              )
            : [...prev.likes, userId],
        };
      });
    }
  };
  useEffect(() => {
    if (!isFetching) {
      isFetchingRef.current = false;
    }
  }, [isFetching]);
  useEffect(() => {
    if (postData?.posts) {
      console.log("adding 10 more items");
      setAllPosts((prev) => {
        const newPosts = postData.posts.filter(
          (newPost: any) => !prev.some((p) => p._id === newPost._id),
        );

        return [...prev, ...newPosts];
      });

      setHasMore(postData.hasMore);
    }
  }, [postData]);

  const lastPageRef = useRef(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingRef.current &&
          hasMounted.current &&
          lastPageRef.current === page
        ) {
          isFetchingRef.current = true;
          lastPageRef.current = page + 1;
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.2 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, page]);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (authUser?.bookmarks) {
      setBookmarks(authUser.bookmarks);
    }
  }, [authUser]);

  const handleBookmark = async () => {
    if (!selectedPost || !authUser?._id) return;

    const postId = selectedPost._id;

    const alreadyBookmarked = bookmarks.some(
      (id) => id.toString() === postId.toString(),
    );

    // 🔥 Optimistic UI update
    setBookmarks((prev) =>
      alreadyBookmarked
        ? prev.filter((id) => id.toString() !== postId.toString())
        : [...prev, postId],
    );

    try {
      await bookmarkPost(postId).unwrap();

      toast.success(
        alreadyBookmarked ? "Post is unbookmarked" : "Post is bookmarked",
      );
    } catch {
      // ❗ rollback
      setBookmarks((prev) =>
        alreadyBookmarked
          ? [...prev, postId]
          : prev.filter((id) => id.toString() !== postId.toString()),
      );
    }
  };

  return (
    <div className="h-screen overflow-y-auto px-5 pb-15 sm:pb-0 pt-7">
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {allPosts?.flatMap(
          (post: any) =>
            post.media?.map((item: any, i: number) => (
              <ExploreItem
                key={`${post._id}-${i}`}
                item={item}
                onClick={() => {
                  setSelectedPost(post);
                  setCurrentAuthorName(post.author.userName);
                  setIsModalOpen(true);
                }}
              />
            )) || [],
        )}
        {isFetching &&
          allPosts.length > 0 &&
          Array.from({ length: 6 }).map((_, i) => {
            const types = ["portrait", "square", "landscape"] as const;
            const randomType = types[i % types.length];

            return <SkeletonCard key={i} type={randomType} />;
          })}
      </Masonry>
      {hasMore && <div ref={loaderRef} className="h-10" />}
      {selectedPost && (
        <CommentPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedPost}
          isLikeLoading={isLikeLoading}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
          isBookmarkLoading={isBookmarking}
          isBookmarked={isBookmarked}
          isLiked={isLiked}
          handleRouteToProfile={() => navigate(`/profile/${currentAuthorName}`)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
