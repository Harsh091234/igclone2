import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { customBaseQuery } from "./baseQueryWithReauth";

export const api = createApi({
  reducerPath: "api",
  baseQuery:customBaseQuery,
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
