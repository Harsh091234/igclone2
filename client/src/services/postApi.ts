import type { Post } from "../types/post.types";
import { api } from "./api";

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
      query: (id) => ({
        url: `/post/get-user-posts/${id}`,
        method: "GET",
      }),
      providesTags: ["UserPosts"],
    }),

    getAllPosts: builder.query({
      query: () => "/post/get-all-posts",
      providesTags: ["UserPosts"],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/delete-post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserPosts"],
    }),

    toggleLikePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/post/like/${postId}`,
        method: "POST",
      }),

      //  OPTIMISTIC UPDATE
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        //  update UserPosts cache
        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getAllPosts", // MUST MATCH QUERY NAME
            undefined,
            (draft) => {
              const post = draft.posts.find((p: Post) => p._id === postId);
              if (!post) return;

              const isLiked = post.likes.includes(userId);

              if (isLiked) {
                post.likes = post.likes.filter((id: string) => id !== userId);
              } else {
                post.likes.push(userId);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          //  rollback if API fails
          patchResult.undo();
        }
      },

    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetUserPostsQuery,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useToggleLikePostMutation
} = postApi;
