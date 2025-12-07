import { editProfile, getAuthUser, getProfile, syncUser, searchUsers } from "#controllers/user.controller.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.put("/edit-profile",requireAuth(), editProfile)
router.post("/sync-user", requireAuth(), syncUser)
router.get('/auth-user', requireAuth(), getAuthUser);
router.get("/profile/:name", requireAuth(), getProfile) //fullname or username
router.get("/search",requireAuth(), searchUsers);

export default router;

