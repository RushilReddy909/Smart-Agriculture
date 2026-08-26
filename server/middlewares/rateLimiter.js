import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// In-memory rate limiting. Counters live in this process only, so they reset
// on restart and are not shared across instances. If the app is ever scaled
// horizontally, swap in a shared store here rather than changing call sites.

const tooManyRequests = (windowSec) => (req, res) =>
  res.status(429).json({
    error: "Too many requests",
    message: `Rate limit exceeded. Try again in ${windowSec} seconds`,
  });

// Unauthenticated auth endpoints - keyed on IP.
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: tooManyRequests(60),
});

// Authenticated endpoints - keyed on user id, falling back to IP.
export const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // ipKeyGenerator normalizes IPv6 addresses to a subnet; returning req.ip
  // directly here would trip the library's IPv6 validation.
  keyGenerator: (req) =>
    req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip),
  handler: tooManyRequests(60),
});
