// features/posts/postsSlice.ts

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import type { Post } from "../types/post.types";
import type {RootState} from "../store/store"

export const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

// selectors
export const {selectAll: selectAllPosts,
        selectById: selectPostById,
        selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

const initialState = postsAdapter.getInitialState();

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // setPosts: postsAdapter.setAll,

    addPosts: postsAdapter.upsertMany,

    // addPost: postsAdapter.upsertOne,

    // removePost: postsAdapter.removeOne,

    toggleLike: (
      state,
      action: {
        payload: {
          postId: string;
          userId: string;
        };
      },
    ) => {
      const { postId, userId } = action.payload;

      const post = state.entities[postId];

      if (!post) return;

      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }
    },
    
  },
});

export const {addPosts,  toggleLike } =
  postsSlice.actions;

export default postsSlice.reducer;
