
import type { EditProfileData, SearchUser, User } from "../types/user.types";
import { api } from "./api";

export interface SyncUserResponse {
  success: boolean;
  user: User;
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

    editProfile: builder.mutation<SyncUserResponse, EditProfileData>({
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
        params: {q: name}
      }),
    }),
  }),
});

export const {useSyncUserMutation, useGetAuthUserQuery, useEditProfileMutation, useGetProfileUserQuery, useLazySearchUsersQuery} = userApi;