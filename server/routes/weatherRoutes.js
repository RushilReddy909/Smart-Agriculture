import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { fetchWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", verifyToken, fetchWeather);

export default router;