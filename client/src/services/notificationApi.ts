import { api } from "./api";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{notifications: any[]}, void>({
      query: () => "/notifications",
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
