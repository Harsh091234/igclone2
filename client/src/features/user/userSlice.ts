import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";


export interface IUser {
  
  email: string;
}

export const syncUser = createAsyncThunk
(
  "user/syncUser",
  async ({ token, email }: {token: string, email: string}, thunkAPI) => {
    try {
      const res = await api.post(
        `/user/sync-user`,
        {email},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.user as IUser;

    } catch (error: any) {
     
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to sync user"
      );
    }
  }
);

export const getAuthUser = createAsyncThunk("/user/getAuthUser", async(token: string, thunkAPI) => {
  try {
    const res = await api.get("/user/auth-user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(!res.data.user) return thunkAPI.rejectWithValue("User not found in DB");
    return res.data.user;

  } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch authenticated user"
      );
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null as IUser | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(syncUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export default userSlice.reducer;


