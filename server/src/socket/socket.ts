import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";
const app: Application = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? true : process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

interface UserStatus {
  socketId: string;
  lastActive: number; // timestamp
}

const userSocketMap: Record<string, UserStatus> = {};

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId]?.socketId;
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (typeof userId === "string") {
    userSocketMap[userId] = { socketId: socket.id, lastActive: Date.now() };
    console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
  }
   emitOnlineUsers();

  socket.on("disconnect", () => {
    if (typeof userId === "string") {
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      if (userSocketMap[userId]) {
        userSocketMap[userId].lastActive = Date.now();
        delete userSocketMap[userId];
      }
    }
   
       emitOnlineUsers();
  });
  
});

function emitOnlineUsers() {
  io.emit(
    "getOnlineUsers",
    Object.entries(userSocketMap).map(([userId, data]) => ({
      userId,
      lastActive: data.lastActive,
    })),
  );
}

export { app, server, io };
