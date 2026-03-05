import { toggleLike } from "../utils/toggleLike";
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

    likeStory: builder.mutation({
      query: ({ storyId }) => ({
        url: `/story/like/${storyId}`,
        method: "POST",
      }),

      async onQueryStarted({ storyId, userId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          storyApi.util.updateQueryData(
            "getAllUsersStory",
            undefined,
            (draft) => {
              draft.stories.forEach((group: any) => {
                const story = group.stories?.find(
                  (s: any) => s._id === storyId,
                );

                if (story) {
                  const alreadyLiked = story.likes.includes(userId);

                  if (alreadyLiked) {
                    story.likes = story.likes.filter(
                      (id: string) => id !== userId,
                    );
                  } else {
                    story.likes.push(userId);
                  }
                }
              });
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    viewStory: builder.mutation({
      query: ({ storyId }) => ({
        url: `/story/view/${storyId}`,
        method: "POST",
      }),
    }),

    getStoryViews: builder.query({
      query: (storyId: string) => ({
        url: `story/get-views/${storyId}`,
        method: "GET",
      }),
      providesTags: ["UserStory"],
    }),
  }),
});

export const {
  useCreateStoryMutation,
  useGetAllUsersStoryQuery,
  useLikeStoryMutation,
  useViewStoryMutation,
  useLazyGetStoryViewsQuery,
} = storyApi;
