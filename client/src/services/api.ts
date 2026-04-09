import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.MODE === "development"
        ? `http://localhost:4000/api`
        : "/api",
    credentials: "include",
     prepareHeaders: (headers, { getState }) => {
    const csrfToken = (getState() as RootState).csrf.token;

    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }

    return headers;
  },
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
