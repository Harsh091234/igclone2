import { requireAuth } from "@clerk/express";
import { upload } from "../../config/multer.js";
import {
  createStory,
  deleteStory,
  getSingleUserStories,
  getStories,
  getStoryViews,
  likeStory,
  viewStory,
} from "./story.controller.js";
import express from "express";
import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  upload.single("media"), createStory);
router.get("/get-all",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getStories);
router.get("/get", apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getSingleUserStories);
router.post("/view/:storyId",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  viewStory);

router.post("/like/:storyId",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  likeStory);
router.get("/get-views/:storyId",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getStoryViews);
router.delete("/delete/:storyId",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  deleteStory);
export default router;
