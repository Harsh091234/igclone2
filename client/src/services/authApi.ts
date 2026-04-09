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
    verifyEmail: builder.mutation({
      query: (token: string) => ({
        url: `/auth/verify/${token}`,
        method: "POST",
  
      }),
      
    }),

    resendVerificationUrl: builder.mutation({
  query: ({email}: {email: string}) => ({
    url: "/auth/resend-verification-url",
    method: "POST",
    body: { email },
  }),
}),
// services/authApi.ts

      forgotPassword: builder.mutation
({
  query: ({email}: {email:string}) => ({
    url: "/auth/forgot-password",
    method: "POST",
    body: {email}
  }),
}),

resetPassword: builder.mutation({
  query: ({ password, token }: {password: string, token: string}) => ({
    url: `/auth/reset-password/${token}`,
    method: "POST",
    body: { password },
  }),
}),
  getCsrfToken: builder.query({
      query: () => "/auth/csrf-token",
    }),


    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

  }),
});

export const {useRegisterMutation, useLoginMutation, useVerifyEmailMutation, useResendVerificationUrlMutation, useForgotPasswordMutation,
  useResetPasswordMutation, useLogoutMutation, useLazyGetCsrfTokenQuery
} = authApi;