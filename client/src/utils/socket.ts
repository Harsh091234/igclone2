import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      query: { userId },
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;


export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
