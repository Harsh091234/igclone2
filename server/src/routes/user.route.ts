import { upload } from "#config/multer.js";
import { editProfileSchema } from "#config/validators/user.validator.js";
import { editProfile, getAuthUser, getProfile, syncUser, searchUsers, getSuggestedUsers, followOrUnfollowUser } from "#controllers/user.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();
router.put("/edit-profile",requireAuth(),upload.single("profilePic"), validate(editProfileSchema), editProfile)
router.post("/sync-user", requireAuth(), syncUser)
router.get('/get-auth-user', requireAuth(), getAuthUser);
router.get("/profile/:name", requireAuth(), getProfile) 
router.get("/search",requireAuth(), searchUsers);
router.get("/fetch-suggested-users", requireAuth(), getSuggestedUsers);
router.post("/follow-unfollow/:id", requireAuth(), followOrUnfollowUser);

export default router;

