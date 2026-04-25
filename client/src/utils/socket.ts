import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    const url =
      import.meta.env.VITE_MODE === "development"
        ? import.meta.env.VITE_BASE_SOCKET_URI
        : "/"; // production uses same origin

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
