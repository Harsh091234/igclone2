import type { SearchUser, User } from "../types/user.types";
import { api } from "./api";

export interface SyncUserResponse {
  success: boolean;
  user: User | null;
}

export interface SearchUserResponse {
  success: boolean;
  users: SearchUser[];
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    syncUser: builder.mutation<SyncUserResponse, void>({
      query: () => ({
        url: "/user/sync-user",
        method: "POST",
      }),
    }),

    getAuthUser: builder.query<SyncUserResponse, void>({
      query: () => ({
        url: "/user/get-auth-user",
      }),
      providesTags: ["User"],
    }),

    getProfileUser: builder.query<SyncUserResponse, string>({
      query: (name) => ({
        url: `/user/profile/${name}`,
      }),
      providesTags: ["User"],
    }),

    editProfile: builder.mutation<SyncUserResponse, FormData>({
      query: (body) => ({
        url: "/user/edit-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    searchUsers: builder.query<SearchUserResponse, string>({
      query: (name) => ({
        url: `/user/search`,
        params: { q: name },
      }),
    }),

    followOrUnfollowUsers: builder.mutation({
      query: (id: string) => ({
        url: `/user/follow-unfollow/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["User"]
    }),

    fetchSuggestedUsers: builder.query({
      query: (limit: number) => ({
        url: `/user/fetch-suggested-users?limit=${limit}`,
        method: "GET"
      })
    })
  }),
});

export const {
  useSyncUserMutation,
  useGetAuthUserQuery,
  useEditProfileMutation,
  useGetProfileUserQuery,
  useLazySearchUsersQuery,
  useFollowOrUnfollowUsersMutation,
  useFetchSuggestedUsersQuery
} = userApi;
