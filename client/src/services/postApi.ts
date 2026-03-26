import type { Post, Reel } from "../types/post.types";
import { toggleLike } from "../utils/toggleLike";
import { api } from "./api";
import { userApi } from "./userApi";

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post/create-post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserPosts"],
    }),

    getUserPosts: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/post/get-user-posts/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["UserPosts", "UserComments"],
    }),

    getUserReels: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/post/get-user-reels/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["UserPosts", "UserComments"],
    }),

    getAllPosts: builder.query({
      query: (page) => `/post/get-all-posts?page=${page}`,
      providesTags: ["UserPosts", "UserComments"],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/delete-post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserPosts"],
    }),

    getAllReels: builder.query({
      query: () => "/post/reels",
      providesTags: ["UserPosts"],
    }),

    toggleLikePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/post/like/${postId}`,
        method: "POST",
      }),

      //  OPTIMISTIC UPDATE
      async onQueryStarted(
        { postId, userId, profileUserId },
        { dispatch, queryFulfilled },
      ) {
        //  update UserPosts cache
        const patchResults = [];

        // 🔹 update ALL POSTS (feed)
        patchResults.push(
          dispatch(
            postApi.util.updateQueryData(
              "getAllPosts",
              undefined, // ✅ CORRECT CACHE KEY
              (draft) => {
                const post = draft.posts.find((p: Post) => p._id === postId);
                if (!post) return;
                toggleLike(post, userId);
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            postApi.util.updateQueryData("getAllReels", undefined, (draft) => {
              const reel = draft.videos.find((r: Reel) => r._id === postId);
              if (reel) toggleLike(reel, userId);
            }),
          ),
        );

        if (profileUserId) {
          patchResults.push(
            dispatch(
              postApi.util.updateQueryData(
                "getUserPosts",
                profileUserId,
                (draft) => {
                  const post = draft.posts.find((p: Post) => p._id === postId);
                  if (post) toggleLike(post, userId);
                },
              ),
            ),
          );
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    toggleBookmarkPost: builder.mutation({
      query: (id) => ({
        url: `/post/bookmark/${id}`,
        method: "POST",
      }),

      //Optimistic
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patches = [];

        // AUTH USER
        patches.push(
          dispatch(
            userApi.util.updateQueryData("getAuthUser", undefined, (draft) => {
              if (!draft.user) return;

              const bookmarks = draft.user.bookmarks ?? [];
              const index = bookmarks.findIndex(
                (id) => id.toString() === postId.toString(),
              );

              if (index !== -1) bookmarks.splice(index, 1);
              else bookmarks.push(postId);
            }),
          ),
        );

        // PROFILE POSTS
        patches.push(
          dispatch(
            postApi.util.updateQueryData("getUserPosts", undefined, (draft) => {
              const post = draft.posts?.find((p: Post) => p._id === postId);
              if (post) post.isBookmarked = !post.isBookmarked;
            }),
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    commentPost: builder.mutation({
      query: ({ text, id }) => ({
        url: `/post/${id}/comment`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["UserComments"],
    }),
    deleteComment: builder.mutation({
      query: (id: string) => ({
        url: `/post/${id}/comment`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserComments"],
    }),

    getAllComments: builder.query({
      query: (id) => `/post/${id}/get-all-comments`,
      providesTags: (id) => [{ type: "UserComments", id }],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetUserPostsQuery,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useToggleLikePostMutation,
  useToggleBookmarkPostMutation,
  useCommentPostMutation,
  useDeleteCommentMutation,
  useGetAllCommentsQuery,
  useGetAllReelsQuery,
  useGetUserReelsQuery,
} = postApi;
