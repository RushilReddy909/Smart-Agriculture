import Redis from "ioredis";

let redis = null;
let isConnected = false;

// Only try to connect if Redis credentials are provided
if (process.env.REDIS_HOST && process.env.REDIS_PASSWORD) {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        // Stop retrying after 3 attempts
        if (times > 3) {
          console.warn(
            "⚠️ Redis connection failed after 3 attempts, running without cache"
          );
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redis.on("connect", () => {
      console.log("✅ Redis connected");
      isConnected = true;
    });

    redis.on("error", (err) => {
      isConnected = false;
      if (!err.message.includes("ECONNREFUSED")) {
        console.warn("⚠️ Redis error:", err.message);
      }
    });
  } catch (error) {
    console.warn("⚠️ Redis initialization failed, running without cache");
    redis = null;
  }
} else {
  console.log("ℹ️ Redis not configured, running without cache");
}

export default redis;
export { isConnected };
