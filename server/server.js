import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
// import { connectRedis } from "./middlewares/redisCache.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  await connectDB();
  // await connectRedis();
  console.log(`Server started on port ${PORT}`);
});
