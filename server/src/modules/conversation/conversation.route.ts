import { validate } from "../../middlewares/validate.middleware.js";
import { createMessageSchema } from "./message.validator.js";
import {
  createMessage,
  getAllMessages,
  getLastMessages,
} from "./conversation.controller.js";
import { upload } from "../../config/multer.js";
import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { apiLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { csrfProtection } from "../../config/csrfProtection.js";
import { authorize } from "../../middlewares/roleMiddleware.js";


const router = Router();

router.post(
  "/send/:receiverId",
apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"),
  upload.array("media", 5),

  createMessage,
);

router.get("/get-all-messages/:receiverId", apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getAllMessages);

router.get("/get-last-messages", apiLimiter,
  protectRoutes,
  csrfProtection,
  authorize("user"), getLastMessages);

  
export default router;
