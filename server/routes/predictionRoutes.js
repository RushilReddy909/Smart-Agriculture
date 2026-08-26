import express from "express";
import axios from "axios";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Proxy endpoint for crop prediction
router.post("/crop", verifyToken, userRateLimiter, async (req, res) => {
  try {
    // The ML service loads the model from disk and makes two upstream
    // weather calls per request, and a sleeping host can take ~50s to wake,
    // so allow a generous ceiling - but never wait forever.
    const response = await axios.post(`${PYTHON_API_URL}/predict`, req.body, {
      timeout: 90000,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Prediction API Error:", error.message);

    // A timeout or refused connection has no error.response
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        detail: "The prediction service took too long to respond.",
      });
    }
    if (!error.response) {
      return res.status(503).json({
        detail: "The prediction service is unavailable.",
      });
    }

    res.status(error.response.status || 500).json({
      detail:
        error.response?.data?.detail ||
        "Failed to get prediction from ML service",
    });
  }
});

export default router;
