import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const connectSocket = (userId: string) => {
  if (!socket) {
   const url =
     import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"; // production uses same origin

   socket = io(url, {
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
