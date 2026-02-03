import {Server} from "socket.io";
import http from "http";
import express, { Application} from "express";
const app: Application = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? true : process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }
})

const userSocketMap: Record<string, string> = {};


export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(typeof userId === "string"){
        userSocketMap[userId] = socket.id;
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`);

    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if(typeof userId === "string"){
           console.log(
             `User connected: ${userId} with socket ID: ${socket.id}`,
           );
            delete userSocketMap[userId]
        }
          io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {app, server, io};