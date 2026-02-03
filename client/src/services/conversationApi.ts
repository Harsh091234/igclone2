
import { api } from "./api";


export const conversationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: ({ receiverId, formData }) => ({
        url: `/conversation/send/${receiverId}`,
        method: "POST",
        body: formData,
      }),
    
    }),

    getAllMessages: builder.query({
      query: (receiverId: string) =>
        `/conversation/get-all-messages/${receiverId}`,
    }),

    getLastMessages: builder.query({
      query: () => "/conversation/get-last-messages",
    }),
  }),
});

export const {
    useCreateMessageMutation,
    useGetLastMessagesQuery,
    useGetAllMessagesQuery

} = conversationApi;
