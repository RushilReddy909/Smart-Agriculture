import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getWeatherForecast,
  getFarmAdvisories,
  getSprayWindows,
  searchLocation,
} from "../controllers/weatherController.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/forecast", verifyToken, userRateLimiter, getWeatherForecast);
router.get("/advisories", verifyToken, userRateLimiter, getFarmAdvisories);
router.get("/spray-windows", verifyToken, userRateLimiter, getSprayWindows);
router.get("/search", verifyToken, userRateLimiter, searchLocation);

export default router;
