import redis, { isConnected } from "../config/redis.js";

const windowKey = (prefix, id, windowSec) => {
  const window = Math.floor(Date.now() / (windowSec * 1000));
  return `rl:${prefix}:${id}:${window}`;
};

const rateLimit = ({ keyPrefix, limit, windowSec, identify }) => {
  return async (req, res, next) => {
    if (!redis || !isConnected) {
      return next();
    }

    const id = identify(req);
    if (!id) {
      return next();
    }

    const key = windowKey(keyPrefix, id, windowSec);

    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSec);
      }

      if (count > limit) {
        return res.status(429).json({
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${windowSec} seconds`,
        });
      }

      return next();
    } catch (error) {
      return next();
    }
  };
};

export const authRateLimiter = rateLimit({
  keyPrefix: "auth",
  limit: 10,
  windowSec: 60,
  identify: (req) => `ip:${req.ip}`,
});

export const userRateLimiter = rateLimit({
  keyPrefix: "user",
  limit: 120,
  windowSec: 60,
  identify: (req) => (req.user?.id ? `user:${req.user.id}` : `ip:${req.ip}`),
});
