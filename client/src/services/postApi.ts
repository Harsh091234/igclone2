import type { Post } from "../types/post.types";
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

    toggleBookmarkPost: builder.mutation({
      query: (id) => ({
        url: `/post/bookmark/${id}`,
        method: "POST",
      }),

      //Optimistic
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getAuthUser", undefined, (draft) => {
            if (!draft.user) return;

            const bookmarks = draft.user.bookmarks ?? [];

            const index = bookmarks?.findIndex(
              (id: any) => id.toString() === postId.toString()
            );
            if (index !== -1) {
              // remove bookmark
              bookmarks.splice(index, 1);
            } else {
              // add bookmark
              bookmarks.push(postId);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),

    commentPost: builder.mutation({
      query: ({text, id}) => ({
        url: `/post/${id}/comment`,
        method: "POST",
        body: {text}
      }),
      invalidatesTags: ["UserComments"]
    }),

    getAllComments: builder.query({
      query: (id) => 
        `/post/${id}/get-all-comments`,
      providesTags: ["UserComments"]
    })
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
  useGetAllCommentsQuery
} = postApi;
