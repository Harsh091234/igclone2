import { Router } from "express";

import { savePublicKey, getPublicKey } from "../controllers/key.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/identity",requireAuth(), savePublicKey);
router.get("/:userId", getPublicKey);

export default router;

