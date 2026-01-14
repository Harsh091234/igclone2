import { api } from "./api";



export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
   
    createPost: builder.mutation({
        query: (data) => ({
            url: "/post/create-post",
            method: "POST",
            body: data,     
        })
    })
  
  }),
});

export const {useCreatePostMutation} = postApi;