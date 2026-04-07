import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.MODE === "development"
        ? `http://localhost:4000/api`
        : "/api",
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "UserPosts",
    "UserComments",
    "Conversation",
    "Messages",
    "UserStory",
  ],
  endpoints: () => ({}),
});
