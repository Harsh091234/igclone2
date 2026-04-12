import { createApi} from "@reduxjs/toolkit/query/react";

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
    "SuggestedUsers"
  ],
  endpoints: () => ({}),
});
