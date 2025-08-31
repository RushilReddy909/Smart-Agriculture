import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/connectDB.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on port ${PORT}`);
});
