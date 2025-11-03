import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { identifyPest } from "../controllers/pestController.js";

const router = express.Router();

router.post("/identify", verifyToken, identifyPest);

export default router;


