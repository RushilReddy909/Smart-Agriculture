import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getWeatherForecast,
  getFarmAdvisories,
  getSprayWindows,
  searchLocation,
} from "../controllers/weatherController.js";

const router = express.Router();

router.get("/forecast", verifyToken, getWeatherForecast);
router.get("/advisories", verifyToken, getFarmAdvisories);
router.get("/spray-windows", verifyToken, getSprayWindows);
router.get("/search", verifyToken, searchLocation);

export default router;
