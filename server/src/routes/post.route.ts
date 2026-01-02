import { upload } from "#config/multer.js";
import { createPost } from "#controllers/post.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/create-post",validate(createPostSchema), upload.array("media", 5), createPost)

export default router;