import { upload } from "#config/multer.js";
import { commentPostSchema, createPostSchema } from "#config/validators/post.validator.js";
import { commentPost, createPost, likePost, unlikePost } from "#controllers/post.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.post("/create-post",requireAuth(), upload.array("media", 5), validate(createPostSchema), createPost)
router.post("/:id/like-post", requireAuth(), likePost)
router.post("/:id/unlike-post", requireAuth(), unlikePost)
router.post("/:id/comment", requireAuth(), validate(commentPostSchema), commentPost)

export default router;