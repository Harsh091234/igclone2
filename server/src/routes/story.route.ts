import { requireAuth } from "@clerk/express";
import { upload } from "../config/multer.js";
import {
  createStory,
  deleteStory,
  getSingleUserStories,
  getStories,
  getStoryViews,
  likeStory,
  viewStory,
} from "../controllers/story.controller.js";
import express from "express";

const router = express.Router();

router.post("/create", requireAuth(), upload.single("media"), createStory);
router.get("/get-all", requireAuth(), getStories);
router.get("/get", requireAuth(), getSingleUserStories);
router.post("/view/:storyId", requireAuth(), viewStory);

router.post("/like/:storyId", requireAuth(), likeStory);
router.get("/get-views/:storyId", requireAuth(), getStoryViews);
router.delete("/delete/:storyId", requireAuth(), deleteStory);
export default router;
