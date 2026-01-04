import { editProfile, getAuthUser, getProfile, syncUser, searchUsers, getSuggestedUsers, followOrUnfollowUser } from "#controllers/user.controller.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();
router.put("/edit-profile",requireAuth(), editProfile)
router.post("/sync-user", requireAuth(), syncUser)
router.get('/get-auth-user', requireAuth(), getAuthUser);
router.get("/profile/:name", requireAuth(), getProfile) //fullname or username
router.get("/search",requireAuth(), searchUsers);
router.get("/fetch-suggested-users", requireAuth(), getSuggestedUsers);
router.post("/followOrUnfollow/:id", requireAuth(), followOrUnfollowUser);

export default router;

