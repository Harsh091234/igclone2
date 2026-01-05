
import type { User } from "../types/user.types";
import { api } from "./api";

export interface SyncUserResponse {
  success: boolean;
  user: User;
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        syncUser: builder.mutation<SyncUserResponse,void>({
            query: () => ({
                url: "/user/sync-user",
                method: "POST"
            })
        }),

        getAuthUser: builder.query<SyncUserResponse, void>({
            query: () => ({
                url: "/user/get-auth-user"
            })
        }),

        getProfileUser: builder.query<SyncUserResponse, string>({
            query: (name) => ({
                url: `/user/profile/${name}`
            })
        }),

        editProfile: builder.mutation({
            query: (body) => ({
                url: "/user/edit-profile",
                method: "PUT",
                body
            })
        }),

    })
})

export const {useSyncUserMutation, useGetAuthUserQuery, useEditProfileMutation, useGetProfileUserQuery} = userApi;