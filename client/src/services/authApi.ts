import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
     register: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
      login: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {useRegisterMutation, useLoginMutation} = authApi;