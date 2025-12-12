import express from "express";
import axios from "axios";

const router = express.Router();

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Proxy endpoint for crop prediction
router.post("/crop", async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Prediction API Error:", error.message);
    res.status(error.response?.status || 500).json({
      detail:
        error.response?.data?.detail ||
        "Failed to get prediction from ML service",
    });
  }
});

export default router;
