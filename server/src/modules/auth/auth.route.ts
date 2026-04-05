import { Router } from "express";

import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationUrl,
  resetPassword,
  verifyEmail,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationUrlSchema,
  resetPasswordSchema,
} from "./auth.validator.js";
import { protectRoutes } from "../../middlewares/protectRoutes.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify/:token", verifyEmail);
router.post(
  "/resend-verification-url",
  validate(resendVerificationUrlSchema),
  resendVerificationUrl,
);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/get-me", protectRoutes, authorize("user"), getMe);
export default router;
