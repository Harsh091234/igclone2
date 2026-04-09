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

router.post("/register",authLimiter,validate(registerSchema), register);
router.post("/verify/:token", authLimiter, verifyEmail);
router.post(
  "/resend-verification-url",
  authLimiter,
  validate(resendVerificationUrlSchema),
  resendVerificationUrl,
);
router.post("/login",authLimiter, validate(loginSchema), login);
router.post("/logout",authLimiter, protectRoutes, csrfProtection, logout);
router.post("/forgot-password",authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token",authLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", authLimiter, refreshToken);
router.get("/get-me",apiLimiter, protectRoutes,  csrfProtection, authorize("user"), getMe);
router.get("/csrf-token",csrfProtection, getCsrfToken )
export default router;
