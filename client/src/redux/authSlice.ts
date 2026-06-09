// redux/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {type User} from "../types/user.types"

type AuthState = {
  user: User | null | undefined;
};


const initialState: AuthState = {
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    toggleBookmarkLocal: (state, action) => {
      if (!state.user) return;

      const postId = action.payload;

      const bookmarks = state.user.bookmarks || [];

      const exists = bookmarks.includes(postId);

      if (exists) {
        state.user.bookmarks = bookmarks.filter((id) => id !== postId);
      } else {
        state?.user?.bookmarks?.push(postId);
      }
    },
  },
});

export const { setUser, clearUser, toggleBookmarkLocal } = authSlice.actions;
export default authSlice.reducer;