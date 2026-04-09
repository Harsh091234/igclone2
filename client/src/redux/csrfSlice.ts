// features/csrfSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CsrfState {
  token: string | null;
}

const initialState: CsrfState = {
  token: null,
};

const csrfSlice = createSlice({
  name: "csrf",
  initialState,
  reducers: {
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearCsrfToken: (state) => {
      state.token = null;
    },
  },
});

export const { setCsrfToken, clearCsrfToken } = csrfSlice.actions;
export default csrfSlice.reducer;