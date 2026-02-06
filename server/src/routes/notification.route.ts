import { getNotifications } from "../controllers/notication.controller.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.get("/", requireAuth(), getNotifications);

export default router;