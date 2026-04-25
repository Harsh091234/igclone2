import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQueryWithReauth = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_MODE === "development"
      ? import.meta.env.VITE_BASE_URI
      : "/api",
  credentials: "include", // send cookies
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = (getState() as any).csrf.token;
    if (csrfToken) headers.set("x-csrf-token", csrfToken);
    return headers;
  },
});

export const customBaseQuery = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQueryWithReauth(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // token expired -> try refresh
    const refreshResult: any = await baseQueryWithReauth(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data?.accessToken) {
      // retry original request
      result = await baseQueryWithReauth(args, api, extraOptions);
    }
  }

  return result;
};
