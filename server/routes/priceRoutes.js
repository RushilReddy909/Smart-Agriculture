import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMandiPrices,
  searchCommodities,
  getStates,
  getPriceTrend,
} from "../controllers/priceController.js";
import { cacheMiddleware } from "../utils/cacheHelper.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get(
  "/mandi",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(3600),
  getMandiPrices
);
router.get(
  "/commodities",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(86400),
  searchCommodities
);
router.get(
  "/states",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(86400),
  getStates
);
router.get(
  "/trend",
  verifyToken,
  userRateLimiter,
  cacheMiddleware(3600),
  getPriceTrend
);

export default router;
