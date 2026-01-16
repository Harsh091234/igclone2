import { upload } from "#config/multer.js";
import {
  commentPostSchema,
  createPostSchema,
} from "#config/validators/post.validator.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  getUserPosts,
  toggleBookmarkPost,
  toggleLikePost,
} from "#controllers/post.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.post(
  "/create-post",
  requireAuth(),
  upload.array("media", 5),
  validate(createPostSchema),
  createPost
);
router.post("/like/:id", requireAuth(), toggleLikePost);

router.post(
  "/:id/comment",
  requireAuth(),
  validate(commentPostSchema),
  commentPost
);
router.get("/get-all-posts", requireAuth(), getAllPosts);
router.get("/get-user-posts/:id", requireAuth(), getUserPosts);
router.get("/:id/get-all-comments", requireAuth(), getAllComments);
router.delete("/delete-post/:id", requireAuth(), deletePost);
router.post("/:id/bookmark", requireAuth(), toggleBookmarkPost);

export default router;
