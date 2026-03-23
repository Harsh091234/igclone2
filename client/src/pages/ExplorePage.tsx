import { useEffect, useState } from "react";
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
import { useGetAuthUserQuery } from "../services/userApi";
import toast from "react-hot-toast";
const ExplorePage = () => {
  const { isLoading: isPostsLoading, data: postData } =
    useGetAllPostsQuery(undefined);
  const [bookmarkPost, { isLoading: isBookmarking }] =
    useToggleBookmarkPostMutation();

  // const demo = true;
  console.log("data", postData);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentAuthorName, setCurrentAuthorName] = useState<string>("");
  const [likePost, { isLoading: isLikeLoading }] = useToggleLikePostMutation();
  const { data: authData } = useGetAuthUserQuery();
  const posts = postData?.posts;

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
    <div className="h-screen overflow-y-auto px-5 pt-7">
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isPostsLoading
          ? Array.from({ length: 15 }).map((_, i) => {
              const types = ["portrait", "square", "landscape"] as const;
              const randomType = types[i % types.length];

              return <SkeletonCard key={i} type={randomType} />;
            })
          : posts?.flatMap(
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
      </Masonry>
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
