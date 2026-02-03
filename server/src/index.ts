import express, { urlencoded } from "express";
import { Application} from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import conversationRoutes from "./routes/conversation.route.js"
import keyRoutes from "./routes/key.route.js"
import cors from "cors";
import http from "http"
import { clerkMiddleware } from "@clerk/express";
import path from "node:path";
import { Server } from "socket.io";
import { app, server } from "./socket/socket.js";
dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3001;






connectDB(process.env.MONGO_URI || "");
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // headers your frontend sends
  }),
);
app.use(clerkMiddleware());


app.use(express.json({limit: "10mb"}));
app.use(urlencoded({limit: "10mb", extended: true}));



app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/keys", keyRoutes);

if (process.env.NODE_ENV === "production") {
  const a = app.use(express.static(path.join(__dirname, "../client/dist")));
  const clientPath = path.join(__dirname, "../client/dist");

  console.log("📁 Client dist path:", clientPath);

  app.use(express.static(clientPath));

  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

