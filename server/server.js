import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "./config/loadEnv.js";
import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import pestRoutes from "./routes/pestRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use("/api/chat", chatRoutes);
app.use("/api/predict", predictionRoutes);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(buildPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(buildPath, "index.html");
  });
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on port ${PORT}`);
});
