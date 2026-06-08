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
import SearchBar from "../components/SearchBar";
import { useLazySearchUsersQuery } from "../services/userApi";
import { SearchUsersSkeleton } from "../components/Skeletons/SearchUsersSkeleton";
import UserAvatar from "../components/UserAvatar";
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
  const LIMIT = 20;
  const { isFetching, data: postData } = useGetAllPostsQuery({page, limit: LIMIT});
  const isFetchingRef = useRef(false);
  const [layoutKey, setLayoutKey] = useState(0);

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [searchUsers, {isLoading: isSearchLoading, data: searchData}] = useLazySearchUsersQuery()
  const [query, setQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const users = searchData?.users ?? [];
  console.log("search data", searchData )
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
    if (page === 1 && postData?.posts) {
      setAllPosts(postData.posts);
    }
  }, [postData, page]);
  useEffect(() => {
    if (postData?.posts) {
      setLayoutKey((prev) => prev + 1); // 👈 force re-layout
    }
  }, [postData]);

  useEffect(() => {
    if (!isFetching) {
      isFetchingRef.current = false;
    }
  }, [isFetching]);
  useEffect(() => {
    if (postData?.posts) {
      setAllPosts((prev) => {
        const newPosts = postData.posts.filter(
          (newPost: any) => !prev.some((p) => p._id === newPost._id),
        );

        return [...prev, ...newPosts];
      });

      if (postData.posts.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(postData.hasMore); // fallback
      }
    }
  }, [postData]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

 let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const nearBottom =
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 300; // 👈 increase buffer

        if (nearBottom && hasMore && !isFetchingRef.current) {
          isFetchingRef.current = true;
          setPage((prev) => prev + 1);
        }
      }, 100); // 👈 debounce
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [hasMore]);

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
    <div
      ref={containerRef}
      className="h-screen relative  overflow-y-auto px-5 pb-15 sm:pb-0 lg:py-7"
    >
      <div className=" sticky top-0 bg-background py-5 z-50 lg:hidden">
        <SearchBar
          onSearch={(value) => {
            setQuery(value);

            if (value.length >= 2) {
              setShowSearchOverlay(true);
              searchUsers(value);
            } else {
              setShowSearchOverlay(false);
            }
          }}
        />
        {showSearchOverlay && (
          <div
            className="
      absolute  
      bg-background 
      w-full
      
    "
          >
            {isSearchLoading ? (
              <div className="px-4">
                <SearchUsersSkeleton />
              </div>
            ) : users.length > 0 ? (
              <div className="px-2">
                {users.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      setShowSearchOverlay(false);
                      navigate(`/profile/${user.userName}`);
                    }}
                    className="
              flex items-center gap-3
              p-2 rounded-lg
              hover:bg-accent
              cursor-pointer
              transition
            "
                  >
                   <UserAvatar classes="h-7 w-7" user={user}/>

                    <div className="flex flex-col ">
                      <p className="font-semibold text-sm">@{user.userName}</p>

                      <p className="text-xs text-muted-foreground">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-10">
                <p className="text-muted-foreground text-sm">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
      {allPosts.length === 0 && !isFetching ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-lg font-medium">
            No posts present
          </p>
        </div>
      ) : (
        <>
          <Masonry
            key={layoutKey}
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {allPosts?.map((post: any) => {
              return (
                <ExploreItem
                  key={post._id}
                  item={post.media[0]} // 👈 preview (first media)
                  aspect={post.media[0].aspect}
                  onClick={() => {
                    setSelectedPost(post);
                    setCurrentAuthorName(post.author.userName);
                    setIsModalOpen(true);
                  }}
                />
              );
            })}

            {isFetching &&
              allPosts.length > 0 &&
              Array.from({ length: 6 }).map((_, i) => {
                const types = ["portrait", "square", "landscape"] as const;
                const randomType = types[i % types.length];

                return <SkeletonCard key={i} type={randomType} />;
              })}
          </Masonry>
        </>
      )}

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
