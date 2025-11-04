import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { identifyPest, getTreatmentDetails } from "../controllers/pestController.js";

const router = express.Router();

router.post("/identify", verifyToken, identifyPest);
router.get("/details", verifyToken, getTreatmentDetails);

export default router;


