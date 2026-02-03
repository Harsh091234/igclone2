import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


interface SocketState {
  onlineUsers: Record<string, number>;
  connected: boolean;
}

const initialState: SocketState = {
    onlineUsers: {},
    connected: false,
}
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<Record<string, number>>) {
      state.onlineUsers = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
  },
});

export const {setConnected, setOnlineUsers} = socketSlice.actions;
export default socketSlice.reducer;


