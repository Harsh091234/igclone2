import type { Post, Reel } from "../types/post.types";
import { toggleLike } from "../utils/toggleLike";
import { api } from "./api";
import { authApi } from "./authApi";


export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post/create-post",
        method: "POST",
        body: data,
      }),
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
      query: ({ id, page, limit }) => ({
        url: `/post/get-user-posts/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.id}`;
      },

      merge: (currentCache, newCache) => {
        const newPosts = newCache.posts.filter(
          (newPost: Post) =>
            !currentCache.posts.some((p: Post) => p._id === newPost._id),
        );

        currentCache.posts.push(...newPosts);
        currentCache.hasMore = newCache.hasMore;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["UserPosts", "UserComments"],
    }),

    getUserReels: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/post/get-user-reels/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.id}`;
      },

      // 🔥 MERGE PAGINATION
      merge: (currentCache, newCache) => {
        // ✅ ensure arrays exist
        const currentReels = currentCache.reels ?? [];
        const incomingReels = newCache?.reels ?? [];

        // ✅ filter safely
        const newItems = incomingReels.filter(
          (newReel: Post) =>
            !currentReels.some((p: Post) => p._id === newReel._id),
        );

        // ✅ assign properly (IMPORTANT)
        currentCache.reels = [...currentReels, ...newItems];

        // ✅ hasMore safe
        currentCache.hasMore = newCache?.hasMore ?? false;
      },

      // 🔥 REFETCH ONLY WHEN PAGE CHANGES
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["UserPosts", "UserComments"],
    }),

    getAllPosts: builder.query({
      query: ({ page, limit }) =>
        `/post/get-all-posts?page=${page}&limit=${limit}`,
      // 🔥 single cache for all pages
      serializeQueryArgs: ({ endpointName }) => endpointName,
      // 🔥 merge paginated data
      merge: (currentCache, newCache) => {
        const newPosts = newCache.posts.filter(
          (newPost: Post) =>
            !currentCache.posts.some((p: Post) => p._id === newPost._id),
        );

        currentCache.posts.push(...newPosts);
        currentCache.hasMore = newCache.hasMore;
      },

      // 🔥 refetch when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["UserPosts", "UserComments"],
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
      providesTags: ["UserPosts"],
    }),

    toggleLikePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/post/like/${postId}`,
        method: "POST",
      }),

      async onQueryStarted(
        { postId, userId },
        { dispatch, getState, queryFulfilled },
      ) {
        const state: any = getState();
        const patchResults: any[] = [];

        const applyLike = (item: Post) => {
          toggleLike(item, userId);
        };

        Object.values(state.api.queries).forEach((query: any) => {
          const args = query.originalArgs;

          const updateList = (list: Post[] = []) => {
            const post = list.find((p) => p._id === postId);
            if (post) applyLike(post);
          };

          // 🔥 FEED POSTS
          if (query.endpointName === "getAllPosts") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getAllPosts", args, (draft) => {
                  updateList(draft.posts);
                }),
              ),
            );
          }

          // 🔥 FEED REELS
          if (query.endpointName === "getAllReels") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getAllReels", args, (draft) => {
                  updateList(draft.videos);
                }),
              ),
            );
          }

          // 🔥 PROFILE POSTS
          if (query.endpointName === "getUserPosts") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getUserPosts", args, (draft) => {
                  updateList(draft.posts);
                }),
              ),
            );
          }

          // 🔥 PROFILE REELS
          if (query.endpointName === "getUserReels") {
            patchResults.push(
              dispatch(
                postApi.util.updateQueryData("getUserReels", args, (draft) => {
                  updateList(draft.reels);
                }),
              ),
            );
          }
        });

        try {
          await queryFulfilled;
        } catch (err) {
          // ❌ rollback if API fails
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    toggleBookmarkPost: builder.mutation({
      query: (id) => ({
        url: `/post/bookmark/${id}`,
        method: "POST",
      }),

      //Optimistic
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const patches = [];
        const state:any= getState();
        // AUTH USER
        patches.push(
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, (draft) => {
              if (!draft.user) return;

              const bookmarks = draft.user.bookmarks ?? [];
              const index = bookmarks.findIndex(
                (id:any) => id.toString() === postId.toString(),
              );

              if (index !== -1) bookmarks.splice(index, 1);
              else bookmarks.push(postId);
            }),
          ),
        );

        // PROFILE POSTS
        Object.values(state.api.queries).forEach((query: any) => {
    const args = query.originalArgs;

    if (query.endpointName === "getUserPosts") {
      patches.push(
        dispatch(
          postApi.util.updateQueryData("getUserPosts", args, (draft) => {
            const post = draft.posts?.find((p: Post) => p._id === postId);
            if (post) post.isBookmarked = !post.isBookmarked;
          })
        )
      );
    }
  });

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
