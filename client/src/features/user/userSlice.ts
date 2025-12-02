import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import type { EditProfileData, User } from "../../types/user.types";
import toast from "react-hot-toast";




export const selectUser = (state: any) => state.user.data;
export const selectProfileUser = (state: any) => state.user.profileUser;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;

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

      return res.data.user;

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
    
    return res.data.user?? null;

  } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch authenticated user"
      );
  }
})

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async ({ token, name  }: {  token: string ,name: string;}, thunkAPI) => {   
   
    
    try {
     
   
      const res = await api.get(`/user/profile/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      console.log("store:",res.data.user)
      
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const editProfile = createAsyncThunk("/user/editProfile", async({token,data}: {token: string, data: EditProfileData}, thunkApi) => {
  try {
    
    const res = await api.put("/user/edit-profile", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) 
    toast.success("Profile Saved");
    return res.data.user;
  } catch (error: any) {
    toast.error("Failed to edit profile");
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to edit profile")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null as User | null,
    profileUser: null as User | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers(builder) {

    // sync user
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

      // get auth user
    builder
    .addCase(getAuthUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(getAuthUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(getAuthUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Error"
    })

    // get profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUser = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //edit profile
    builder
    .addCase(editProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    } )
    .addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

  },

  

});

export default userSlice.reducer;


