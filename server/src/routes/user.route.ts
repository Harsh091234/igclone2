import { editProfile, getAuthUser, syncUser } from "#controllers/user.controller.js";
import { requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

router.put("/edit-profile",requireAuth(), editProfile)
router.post("/sync-user", requireAuth(), syncUser)
router.get('/auth-user', requireAuth(), getAuthUser);

export default router;

