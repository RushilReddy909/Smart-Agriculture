import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import pestRoutes from "./routes/pestRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/price", priceRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on port ${PORT}`);
});
