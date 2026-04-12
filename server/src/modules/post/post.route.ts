import { upload } from "../../config/multer.js";
import { commentPostSchema, createPostSchema } from "./post.validator.js";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getAllComments,
  getAllPosts,
  getAllReels,
  getUserPosts,
  getUserReels,
  toggleBookmarkPost,
  toggleLikePost,
} from "./post.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { Router } from "express";
import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/create-post",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  upload.array("media", 5),
  validate(createPostSchema),
  createPost,
);

router.post("/like/:id",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), toggleLikePost);

router.post(
  "/:id/comment",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  validate(commentPostSchema),
  commentPost,
);
router.delete("/:id/comment",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  deleteComment);

router.get("/get-all-posts",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getAllPosts);

router.get("/get-user-posts/:id",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getUserPosts);

router.get("/get-user-reels/:id",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getUserReels);

router.get("/:id/get-all-comments", apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getAllComments);

router.get("/reels",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  getAllReels);

router.delete("/delete-post/:id",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),  deletePost);

router.post("/bookmark/:id",apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), toggleBookmarkPost);

export default router;
