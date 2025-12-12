import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getWeatherForecast,
  getFarmAdvisories,
  getSprayWindows,
  searchLocation,
} from "../controllers/weatherController.js";
import { cacheMiddleware } from "../utils/cacheHelper.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get(
  "/forecast",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(3600),
  getWeatherForecast
);
router.get(
  "/advisories",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(3600),
  getFarmAdvisories
);
router.get(
  "/spray-windows",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(3600),
  getSprayWindows
);
router.get(
  "/search",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(86400),
  searchLocation
);

export default router;
