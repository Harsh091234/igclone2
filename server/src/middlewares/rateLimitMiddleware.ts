import rateLimit from "express-rate-limit";


const rateLimitHandler = (req: any, res: any, message: string) => {
  const resetTime = req.rateLimit?.resetTime;

  // fallback safety
  if (!resetTime) {
    return res.status(429).json({
      success: false,
      message: `${message} Try again later.`,
    });
  }

  const retryAfterSeconds = Number(Math.max(
    0,
    Math.ceil((resetTime.getTime() - Date.now()) / 1000)
  ));

  res.status(429).json({
    success: false,
    message: `${message} Try again in ${retryAfterSeconds}s.`,
    retryAfter: retryAfterSeconds, // 🔥 important (frontend uses this)
  });
};

// 🔥 Reusable limiter factory
const createLimiter = (max: number, message: string) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,

    // ✅ KEY FIX: separate limits per route + user
    keyGenerator: (req) => {
      return (
        req.ip +
        req.originalUrl + // route-specific
        (req.body?.email || "") // user-specific (optional but 🔥)
      );
    },

    handler: (req, res) => rateLimitHandler(req, res, message),

    standardHeaders: true,
    legacyHeaders: false,
  });


// ✅ Use different configs
export const apiLimiter = createLimiter(
  50,
  "Too many requests."
);

export const authLimiter = createLimiter(
  6,
  "Too many attempts."
);