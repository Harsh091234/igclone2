import { api } from "./api";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notifications",
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
