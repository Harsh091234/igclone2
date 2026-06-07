import { current } from "@reduxjs/toolkit";
import type { Post, Reel } from "../types/post.types";

import { api } from "./api";
import { authApi } from "./authApi";
import { addPosts, toggleLike } from "../redux/postSlice";

export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post/create-post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserReels"],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        const patchResults: any[] = [];

        try {
          const { data } = await queryFulfilled;

          const newPost = {
            ...data.post,
            likes: data.post.likes ?? [],
            comments: data.post.comments ?? [],
          };

          const state: any = getState();

          Object.values(state.api.queries).forEach((query: any) => {
            const args = query.originalArgs;

            // 🔥 FEED POSTS
            if (query.endpointName === "getAllPosts") {
              patchResults.push(
                dispatch(
                  postApi.util.updateQueryData("getAllPosts", args, (draft) => {
                    if (!draft?.posts) return;

                    draft.posts = [
                      newPost,
                      ...draft.posts.filter((p: Post) => p._id !== newPost._id),
                    ];
                  }),
                ),
              );
            }

            // 🔥 FEED REELS
            if (
              query.endpointName === "getAllReels" &&
              newPost.media?.some((m: any) => m.type === "video")
            ) {
              patchResults.push(
                dispatch(
                  postApi.util.updateQueryData("getAllReels", args, (draft) => {
                    if (!draft?.videos) return;

                    draft.videos = [
                      newPost,
                      ...draft.videos.filter(
                        (p: Reel) => p._id !== newPost._id,
                      ),
                    ];
                  }),
                ),
              );
            }

            // 🔥 USER POSTS
            if (query.endpointName === "getUserPosts" && args?.page === 1) {
              patchResults.push(
                dispatch(
                  postApi.util.updateQueryData(
                    "getUserPosts",
                    args,
                    (draft) => {
                      if (!draft?.posts) return;

                      draft.posts = [
                        newPost,
                        ...draft.posts.filter(
                          (p: Post) => p._id !== newPost._id,
                        ),
                      ];

                      draft.hasMore = true; // optional
                    },
                  ),
                ),
              );
            }
            // 🔥 USER REELS
            if (
              query.endpointName === "getUserReels" &&
              newPost.media?.some((m: any) => m.type === "video")
            ) {
              patchResults.push(
                dispatch(
                  postApi.util.updateQueryData(
                    "getUserReels",
                    args,
                    (draft) => {
                      if (!draft?.reels) return;

                      draft.reels = [
                        newPost,
                        ...draft.reels.filter(
                          (p: Post) => p._id !== newPost._id,
                        ),
                      ];
                    },
                  ),
                ),
              );
            }
          });
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    getUserPosts: builder.query({
      query: ({ id }) => `/post/get-user-posts/${id}`,

      async onCacheEntryAdded(arg, { cacheDataLoaded, dispatch }) {
        const { data } = await cacheDataLoaded;

        dispatch(addPosts(data.posts));
      },

      // providesTags: ["UserComments"],
    }),

    getUserReels: builder.query({
      query: ({ id }) => ({
        url: `/post/get-user-reels/${id}`,
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(addPosts(data.posts));
      },
      // providesTags: ["UserComments"],
    }),

    getAllPosts: builder.query({
      query: () => `/post/get-all-posts`,
      // providesTags: [ "UserComments"],
      async onCacheEntryAdded(arg, { cacheDataLoaded, dispatch }) {
        const { data } = await cacheDataLoaded;

        dispatch(addPosts(data.posts));
      },
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/delete-post/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const patchResults: any[] = [];
        const state: any = getState();

        Object.values(state.api.queries).forEach((query: any) => {
          const args = query.originalArgs;

          const remove = (list: Post[]) => list.filter((p) => p._id !== postId);

          // FEED POSTS
          if (query.endpointName === "getAllPosts") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getAllPosts", args, (draft) => {
                  if (!draft?.posts) return;
                  draft.posts = remove(draft.posts);
                }),
              ),
            );
          }

          // FEED REELS
          if (query.endpointName === "getAllReels") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getAllReels", args, (draft) => {
                  if (!draft?.videos) return;
                  draft.videos = remove(draft.videos);
                }),
              ),
            );
          }

          // USER POSTS
          if (query.endpointName === "getUserPosts") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getUserPosts", args, (draft) => {
                  if (!draft?.posts) return;
                  draft.posts = remove(draft.posts);
                }),
              ),
            );
          }

          // USER REELS
          if (query.endpointName === "getUserReels") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getUserReels", args, (draft) => {
                  if (!draft?.reels) return;
                  draft.reels = remove(draft.reels);
                }),
              ),
            );
          }
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ["UserPosts"],
    }),

    getAllReels: builder.query({
      query: () => "/post/reels",
      // providesTags: ["UserReels"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        console.log("reels", data)
        dispatch(addPosts(data.posts));
      },
    }),

    toggleLikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/post/like/${postId}`,
        method: "POST",
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        dispatch(toggleLike({ postId, userId }));

        try {
          await queryFulfilled;
        } catch {
          dispatch(toggleLike({ postId, userId }));
        }
      },
    }),

    toggleBookmarkPost: builder.mutation({
      query: (id) => ({
        url: `/post/bookmark/${id}`,
        method: "POST",
      }),
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
