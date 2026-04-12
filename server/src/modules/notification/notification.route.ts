import { getNotifications } from "./notification.controller.js";
import { Router } from "express";

import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "../../middlewares/roleMiddleware.js";


const router = Router();

router.get("/",   apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getNotifications);

export default router;
