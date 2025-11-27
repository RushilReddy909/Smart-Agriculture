import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMandiPrices,
  searchCommodities,
  getStates,
  getPriceTrend,
} from "../controllers/priceController.js";

const router = express.Router();

router.get("/mandi", verifyToken, getMandiPrices);
router.get("/commodities", verifyToken, searchCommodities);
router.get("/states", verifyToken, getStates);
router.get("/trend", verifyToken, getPriceTrend);

export default router;
