import redis, { isConnected } from "../config/redis.js";

export async function getCached(key) {
  if (!redis || !isConnected) {
    return null;
  }

  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 3600) {
  if (!redis || !isConnected) {
    return;
  }

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    // Silently fail
  }
}

export function cacheMiddleware(ttlSeconds = 3600) {
  return async (req, res, next) => {
    const cacheKey = `cache:${req.originalUrl}`;

    try {
      const cached = await getCached(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        setCache(cacheKey, data, ttlSeconds);
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.warn("Cache middleware error:", error.message);
      next();
    }
  };
}
