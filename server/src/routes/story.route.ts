import { upload } from "../config/multer.js";
import { createStory } from "../controllers/story.controller.js";
import express from "express";

const router = express.Router();

router.post("/create", upload.single("media"), createStory);

export default router;