import { api } from "./api";

export const keysApi = api.injectEndpoints({
  endpoints: (builder) => ({
    savePublicKey: builder.mutation({
      // input: base64 public key
      query: (publicKey) => ({
        url: "/keys/identity",
        method: "POST",
        body: { publicKey },
      }),
    }),

    getPublicKey: builder.query({
      // input: userId
      query: (userId) => ({
        url: `/keys/${userId}`,
      }),
    }),
  }),
});

export const { useSavePublicKeyMutation, useGetPublicKeyQuery } = keysApi;
