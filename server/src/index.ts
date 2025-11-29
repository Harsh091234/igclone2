import express, { urlencoded } from "express";
import { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "#config/db.js";
import userRoutes from "#routes/user.route.js"
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Application = express();

connectDB(process.env.MONGO_URI || "");
app.use(clerkMiddleware());

app.use(cors(
  {
    origin: "http://localhost:5173",  
    credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],   // headers your frontend sends
                
  }
));
app.use(express.json());
app.use(urlencoded({extended: true}))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use("/api/user", userRoutes);


app.listen(PORT, () => {
  
  console.log(`Example app listening on port ${PORT}`);
});

