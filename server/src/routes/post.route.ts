import { upload } from "#config/multer.js";
import { createPostSchema } from "#config/validators/post.validator.js";
import { createPost } from "#controllers/post.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.post("/create-post",requireAuth(), upload.array("media", 5), validate(createPostSchema), createPost)

export default router;