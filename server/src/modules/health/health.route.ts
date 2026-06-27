import express, {type Response, type Request} from "express";

const router = express.Router();

router.get("/", (_, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is awake",
    timestamp: Date.now(),
  });
});

export default router;
