
import { api } from "./api";


export const conversationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: ({ receiverId, formData }) => ({
        url: `/conversation/send/${receiverId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Messages", "Conversation"],
    }),

    getAllMessages: builder.query({
      query: (receiverId: string) =>
        `/conversation/get-all-messages/${receiverId}`,
      providesTags: ["Messages", "Conversation"],
    }),

    getLastMessages: builder.query({
      query: () => "/conversation/get-last-messages"
    })
  }),
});

export const {
    useCreateMessageMutation,
    useGetLastMessagesQuery,
    useGetAllMessagesQuery

} = conversationApi;
