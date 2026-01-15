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
      providesTags: ["UserPosts"]
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/delete-post/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["UserPosts"]
    })
  }),
});

export const {
  useCreatePostMutation,
  useGetUserPostsQuery,
  useGetAllPostsQuery,
  useDeletePostMutation
} = postApi;
