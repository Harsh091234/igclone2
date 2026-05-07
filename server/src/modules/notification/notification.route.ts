import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification.controller.js";
import { Router } from "express";

import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/get-all",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  getNotifications,
);

router.patch(
  "/mark-read/:id",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  markNotificationRead,
);
router.patch(
  "/mark-all-read",
  apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  markAllNotificationsRead,
);

export default router;
