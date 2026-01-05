
import type { SyncUserResponse} from "../types/user.types";
import { api } from "./api";



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

        editProfile: builder.mutation({
            query: (body) => ({
                url: "/user/edit-profile",
                method: "PUT",
                body
            })
        })  

    })
})

export const {useSyncUserMutation, useGetAuthUserQuery, useEditProfileMutation} = userApi;