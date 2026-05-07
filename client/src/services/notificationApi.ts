import { api } from "./api";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ notifications: any[] }, void>({
      query: () => "/notifications/get-all",
      providesTags: ["Notifications"]
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"]
    }),
    markAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/mark-read/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } = notificationApi;
