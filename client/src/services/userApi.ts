import type { SearchUser, User } from "../types/user.types";
import { api } from "./api";
import { authApi } from "./authApi";

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


    getProfileUser: builder.query<SyncUserResponse, string>({
      query: (name) => ({
        url: `/user/profile/${name}`,
      }),
      providesTags: ["User"],
    }),

    editProfile: builder.mutation<SyncUserResponse, FormData>({
      query: (body) => ({
        url: "/user/edit-profile",
        method: "PATCH",
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

  followOrUnfollowUsers: builder.mutation<
  any,
  { userId: string; userName: string }
>({
  query: ({ userId }) => ({
    url: `/user/follow-unfollow/${userId}`,
    method: "POST",
  }),
  invalidatesTags: ["User"],
  async onQueryStarted(
    { userId, userName },
    { dispatch, queryFulfilled, getState }
  ) {
    const state: any = getState();

    const authUser = authApi.endpoints.getMe.select(undefined)(state)?.data?.user;
    if (!authUser) return;

    const authUserId = authUser._id;

    const getId = (u: any) => (typeof u === "string" ? u : u?._id);

    const isOwnProfile = authUser.userName === userName;

    // =========================
    // 1. AUTH USER FOLLOWING
    // =========================
    const patchAuthUser = dispatch(
      authApi.util.updateQueryData("getMe", undefined, (draft: any) => {
        const following = draft.user.following ?? [];

        const index = following.findIndex(
          (f: any) => getId(f) === userId
        );

        if (index > -1) {
          following.splice(index, 1);
        } else {
          following.push({ _id: userId });
        }
      })
    );

    // =========================
    // 2. PROFILE USER FOLLOWERS + FOLLOWING SYNC
    // =========================
    let patchProfileUser;

    if (!isOwnProfile) {
      patchProfileUser = dispatch(
        userApi.util.updateQueryData(
          "getProfileUser",
          userName,
          (draft: any) => {
            const followers = draft.user.followers ?? [];
            const following = draft.user.following ?? [];

            // toggle followers (auth user in target profile)
            const followerIndex = followers.findIndex(
              (u: any) => getId(u) === authUserId
            );

            if (followerIndex > -1) {
              followers.splice(followerIndex, 1);
            } else {
              followers.push({
                _id: authUserId,
                userName: authUser.userName,
                fullName: authUser.fullName,
                profilePic: authUser.profilePic,
              });
            }

            // optional: keep following consistent (if API returns it)
            draft.user.followers = followers;
            draft.user.following = following;
          }
        )
      );
    }

    // =========================
    // 3. SUGGESTED USERS FIX (IMPORTANT)
    // =========================
   const patchSuggestedUsers = dispatch(
  userApi.util.updateQueryData(
    "fetchSuggestedUsers",
    14,
    (draft: any) => {
      const target = draft.users?.find((u: any) => u._id === userId);

      if (!target) return;

      // toggle instantly
      target.isFollowing = !target.isFollowing;

      // OPTIONAL (better UX): also update follower count if present
      if (typeof target.followersCount === "number") {
        target.followersCount += target.isFollowing ? 1 : -1;
      }
    }
  )
);

    try {
      await queryFulfilled;
      // dispatch(userApi.util.invalidateTags(["User"]));
  
    } catch (err) {
      patchAuthUser.undo();
      patchProfileUser?.undo();
      patchSuggestedUsers.undo();
    }
  },
}),

    fetchSuggestedUsers: builder.query({
      query: (limit: number) => ({
        url: `/user/fetch-suggested-users?limit=${limit}`,
        method: "GET"
      }),
      providesTags: ["SuggestedUsers"]
     
    })
  }),
});

export const {
  useSyncUserMutation,

  useEditProfileMutation,
  useGetProfileUserQuery,
  useLazySearchUsersQuery,
  useSearchUsersQuery,
  useFollowOrUnfollowUsersMutation,
  useFetchSuggestedUsersQuery
} = userApi;
