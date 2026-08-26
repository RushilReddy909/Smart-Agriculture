import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMandiPrices,
  searchCommodities,
  getStates,
  getPriceTrend,
} from "../controllers/priceController.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/mandi", verifyToken, userRateLimiter, getMandiPrices);
router.get("/commodities", verifyToken, userRateLimiter, searchCommodities);
router.get("/states", verifyToken, userRateLimiter, getStates);
router.get("/trend", verifyToken, userRateLimiter, getPriceTrend);

export default router;
