import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min 
  max: 100, 
  message: {
    success: false,
    message: "Too many requests, please try again 15 mins later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // only 5 attempts
  message: {
    success: false,
    message: `Too many login attempts. Try again  15 mins later.`,
  },
});