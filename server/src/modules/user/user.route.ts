import { upload } from "../../config/multer.js";
import { editProfileSchema } from "./user.validator.js";
import {
  editProfile,
  getAuthUser,
  getProfile,

  searchUsers,
  getSuggestedUsers,
  followOrUnfollowUser,
} from "./user.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { Router } from "express";
import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "@/middlewares/roleMiddleware.js";

const router = Router();
router.patch(
  "/edit-profile",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
 
  upload.single("profilePic"),
  validate(editProfileSchema),
  editProfile,
);


router.get("/profile/:name", apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getProfile);
router.get("/search",  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), searchUsers);
router.get("/fetch-suggested-users",  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getSuggestedUsers);
router.post("/follow-unfollow/:id",  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), followOrUnfollowUser);

export default router;
