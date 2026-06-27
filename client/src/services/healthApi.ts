import { api } from "./api";

export const healthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    healthCheck: builder.query<{ status: string }, void>({
      query: () => "/health",
    }),
  }),
});

export const { useLazyHealthCheckQuery } = healthApi;
