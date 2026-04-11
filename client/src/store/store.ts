import { configureStore } from '@reduxjs/toolkit'
import socketReducer from '../redux/socketSlice'
import { api } from '../services/api'
import notificationReducer from "../redux/noticationSlice"
import csrfReducer from "../redux/csrfSlice"
import authReducer from "../redux/authSlice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    socket: socketReducer,
    notifications: notificationReducer,
    csrf: csrfReducer,
    auth: authReducer,
   
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch