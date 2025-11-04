import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { handleChatMessage } from "../controllers/chatController.js";

const router = express.Router();

router.post("/message", verifyToken, handleChatMessage);

export default router;
