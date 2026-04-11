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
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;