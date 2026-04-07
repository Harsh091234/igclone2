import { Router } from "express";

import {
  forgotPassword,
  getCsrfToken,
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
import { apiLimiter, authLimiter } from "../../middlewares/rateLimitMiddleware.js";
import { csrfProtection } from "../../config/csrfProtection.js";
const router = Router();

router.post("/register",apiLimiter,validate(registerSchema), register);
router.post("/verify/:token", verifyEmail);
router.post(
  "/resend-verification-url",
  apiLimiter,
  validate(resendVerificationUrlSchema),
  resendVerificationUrl,
);
router.post("/login",authLimiter, validate(loginSchema), login);
router.post("/logout",apiLimiter, protectRoutes, logout);
router.post("/forgot-password",apiLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", apiLimiter, refreshToken);
router.get("/get-me",apiLimiter, protectRoutes,  csrfProtection, authorize("user"), getMe);
router.get("/csrf-token",csrfProtection, getCsrfToken )
export default router;
