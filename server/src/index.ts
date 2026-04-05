import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./modules/user/user.route.js";
import postRoutes from "./modules/post/post.route.js";
import conversationRoutes from "./modules/conversation/conversation.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";
import storyRoutes from "./modules/story/story.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import path from "node:path";
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";
dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3001;

connectDB(process.env.MONGO_URI || "");
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:3000", "http://localhost:5173"].filter(Boolean) as string[],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // headers your frontend sends
  }),
) ;

// app.use(clerkMiddleware());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/story", storyRoutes);

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
