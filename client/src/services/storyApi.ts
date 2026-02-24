import { api } from "./api";

const storyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStory: builder.mutation({
      query: (data) => ({
        url: "story/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserStory"],
    }),

    getAllUsersStory: builder.query({
      query: () => "/story/get-all",
      providesTags: ["UserStory"],
    }),
  }),
});

export const { useCreateStoryMutation, useGetAllUsersStoryQuery } = storyApi;
