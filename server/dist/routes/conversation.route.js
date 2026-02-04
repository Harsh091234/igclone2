import { createMessage, getAllMessages, getLastMessages, } from "../controllers/conversation.controller.js";
import { upload } from "../config/multer.js";
import { Router } from "express";
import { requireAuth } from "@clerk/express";
const router = Router();
router.post("/send/:receiverId", requireAuth(), upload.array("media", 5), createMessage);
router.get("/get-all-messages/:receiverId", requireAuth(), getAllMessages);
router.get("/get-last-messages", requireAuth(), getLastMessages);
export default router;
