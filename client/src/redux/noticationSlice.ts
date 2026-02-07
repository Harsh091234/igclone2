import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  type: "like" | "comment" | "follow";
  receiver: string;
  sender: {
    _id: string;
    userName?: string;
    profilePic?: string
  };
  post: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift({ ...action.payload, isRead: false });
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
  },
});

export const { addNotification, markAllRead, setNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
