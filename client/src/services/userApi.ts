
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
        })
    })
})

export const {useSyncUserMutation, useGetAuthUserQuery} = userApi;