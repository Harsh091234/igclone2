import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "/",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});