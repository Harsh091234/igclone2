import express, { urlencoded } from "express";
import { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import path from "node:path";
dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3001;
const app: Application = express();

connectDB(process.env.MONGO_URI || "");
app.use(clerkMiddleware());

app.use(cors(
  {
    origin: process.env.NODE_ENV === "production"? true : process.env.CLIENT_URL,  
    credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],   // headers your frontend sends
                
  }
));
app.use(express.json({limit: "10mb"}));
app.use(urlencoded({limit: "10mb", extended: true}))



app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);


if (process.env.NODE_ENV === "production") {
  const a = app.use(express.static(path.join(__dirname, "../client/dist")));
  const clientPath = path.join(__dirname, "../client/dist");

  console.log("📁 Client dist path:", clientPath);

  app.use(express.static(clientPath));

  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  
  console.log(`Example app listening on port ${PORT}`);
});

